# Deployment Guide - AWS EC2

This guide will help you deploy the Helpdesk Platform to AWS EC2 using Docker Hub and GitHub Actions.

## 📋 Prerequisites

1. **AWS Account** with EC2 access
2. **Docker Hub Account** (free tier works)
3. **GitHub Repository** with Actions enabled
4. **EC2 Instance** running Ubuntu 20.04+ or Amazon Linux 2

## 🔧 Step 1: Set Up Docker Hub

### 1.1 Create Docker Hub Account

1. Go to [Docker Hub](https://hub.docker.com/)
2. Sign up for a free account
3. Create a repository named `helpdesk-platform`

### 1.2 Generate Access Token

1. Go to Docker Hub → Account Settings → Security
2. Click "New Access Token"
3. Name it: `github-actions`
4. Copy the token (you'll need it for GitHub secrets)

## ☁️ Step 2: Set Up AWS EC2 Instance

### 2.1 Launch EC2 Instance

1. **Go to AWS Console** → EC2 → Launch Instance
2. **Choose AMI**: Ubuntu Server 22.04 LTS (or Amazon Linux 2)
3. **Instance Type**: t2.micro (free tier) or t3.small (recommended)
4. **Key Pair**: Create or select an existing key pair
5. **Network Settings**:
   - Allow HTTP (port 80)
   - Allow HTTPS (port 443)
   - Allow Custom TCP (port 3000) - for testing
   - Allow SSH (port 22) from your IP
6. **Storage**: 20 GB minimum
7. **Launch Instance**

### 2.2 Configure Security Group

Add these inbound rules:

- **SSH (22)**: Your IP only
- **HTTP (80)**: 0.0.0.0/0 (or use a load balancer)
- **HTTPS (443)**: 0.0.0.0/0 (or use a load balancer)
- **Custom TCP (3000)**: Your IP only (for testing)

### 2.3 Connect to EC2 Instance

```bash
# Replace with your key file and instance details
ssh -i your-key.pem ubuntu@your-ec2-ip-address
```

### 2.4 Install Docker on EC2

**For Ubuntu:**

```bash
# Update system
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in for group changes to take effect
exit
```

**For Amazon Linux 2:**

```bash
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2.5 Clone Repository on EC2

```bash
# Create app directory
mkdir -p ~/helpdesk-platform
cd ~/helpdesk-platform

# Clone repository (or use deployment script)
git clone https://github.com/YOUR_USERNAME/Cloud-Ready-Software-Product.git .

# Copy production docker-compose file
cp docker-compose.prod.yml docker-compose.yml
```

### 2.6 Create Environment File

```bash
# Create .env file
nano .env
```

Add these variables:

```env
DOCKERHUB_USERNAME=your-dockerhub-username
MONGODB_URI=mongodb://mongodb:27017/helpdesk
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
```

## 🔐 Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

### Docker Hub Secrets

- **`DOCKERHUB_USERNAME`**: Your Docker Hub username
- **`DOCKERHUB_TOKEN`**: Your Docker Hub access token

### AWS Secrets

- **`AWS_ACCESS_KEY_ID`**: Your AWS access key
- **`AWS_SECRET_ACCESS_KEY`**: Your AWS secret key
- **`AWS_REGION`**: Your AWS region (e.g., `us-east-1`)

### EC2 Secrets

- **`EC2_HOST`**: Your EC2 public IP or domain (e.g., `ec2-xx-xx-xx-xx.compute-1.amazonaws.com`)
  - **`EC2_USER`**: SSH user (usually `ubuntu` for Ubuntu, `ec2-user` for Amazon Linux)
  - **`EC2_SSH_KEY`**: Your private key content (the .pem file content)

### Application Secrets

- **`MONGODB_URI`**: MongoDB connection string (use `mongodb://mongodb:27017/helpdesk` for local MongoDB in Docker)
- **`JWT_SECRET`**: Your JWT secret key (same as in EC2 .env)

## 🚀 Step 4: Deploy

### Option A: Automatic Deployment (Recommended)

1. **Push to main branch** - GitHub Actions will automatically:

   - Run tests
   - Build Docker image
   - Push to Docker Hub
   - Deploy to EC2

2. **Monitor deployment**:
   - Go to GitHub → Actions tab
   - Watch the workflow run

### Option B: Manual Deployment

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Navigate to project
cd ~/helpdesk-platform

# Pull latest code
git pull origin main

# Run deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# Or use docker-compose directly
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 Step 5: Set Up Domain & SSL (Optional)

### 5.1 Point Domain to EC2

1. Go to your domain registrar
2. Add an A record pointing to your EC2 public IP

### 5.2 Install Nginx (Reverse Proxy)

```bash
sudo apt-get install nginx -y
```

### 5.3 Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/helpdesk
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/helpdesk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5.4 Install SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## 📊 Step 6: Monitor & Maintain

### Check Application Status

```bash
# View running containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check application health
curl http://localhost:3000/api/auth/me
```

### Update Application

Simply push to the main branch - GitHub Actions will handle the rest!

### Backup MongoDB

```bash
# Create backup
docker exec helpdesk-mongodb mongodump --out /data/backup

# Restore backup
docker exec helpdesk-mongodb mongorestore /data/backup
```

## 🔍 Troubleshooting

### Application Not Starting

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check container status
docker ps -a

# Restart containers
docker-compose -f docker-compose.prod.yml restart
```

### Can't Connect to EC2

1. Check security group rules
2. Verify key pair permissions: `chmod 400 your-key.pem`
3. Check EC2 instance status in AWS Console

### Docker Hub Authentication Failed

1. Verify Docker Hub credentials in GitHub secrets
2. Check token hasn't expired
3. Ensure repository name matches

### MongoDB Connection Issues

```bash
# Check MongoDB container
docker logs helpdesk-mongodb

# Verify network
docker network ls
docker network inspect helpdesk-network
```

## 📝 Environment Variables Reference

| Variable             | Description               | Example                            |
| -------------------- | ------------------------- | ---------------------------------- |
| `DOCKERHUB_USERNAME` | Docker Hub username       | `yourusername`                     |
| `MONGODB_URI`        | MongoDB connection string | `mongodb://mongodb:27017/helpdesk` |
| `JWT_SECRET`         | Secret for JWT tokens     | `your-secret-key`                  |
| `NODE_ENV`           | Environment mode          | `production`                       |

## 🎯 Next Steps

1. ✅ Set up monitoring (CloudWatch, DataDog, etc.)
2. ✅ Configure auto-scaling
3. ✅ Set up database backups
4. ✅ Add CI/CD for staging environment
5. ✅ Implement blue-green deployments

---

**Need Help?** Check the [README.md](./README.md) or open an issue on GitHub.

