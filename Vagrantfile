Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "focus-lite-dev"

  # Keep it simple: one VM, one shared folder
  config.vm.synced_folder ".", "/vagrant", type: "virtualbox"

  # Forward only what you actually use in dev
  config.vm.network "forwarded_port", guest: 5173, host: 5173, auto_correct: true # Vite
  config.vm.network "forwarded_port", guest: 5000, host: 5000, auto_correct: true # API
  config.vm.network "forwarded_port", guest: 5432, host: 5433, auto_correct: true # Postgres (host uses 5433)
  config.vm.network "forwarded_port", guest: 8080, host: 8081, host_ip: "127.0.0.1" # Prod nginx

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 4096
    vb.cpus = 2
  end

  # Install Docker Engine + Docker Compose plugin inside the VM
  config.vm.provision "shell", inline: <<-SHELL
    set -e

    sudo apt-get update -y
    sudo apt-get install -y ca-certificates curl gnupg

    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    sudo usermod -aG docker vagrant

    echo "Docker installed. You may need to logout/login (vagrant reload) for group changes."
  SHELL
end
