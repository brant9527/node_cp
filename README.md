
# node-server
this is my personal project to build server by node in centos7.4
个人node项目 环境centos7.4
## how to build environment in linux.
 ### download 下载
 wget -c https://nodejs.org/dist/v6.10.0/node-v6.10.0.tar.gz
 ### release 解压 
 tar -xvf node-v9.8.0-linux-x64.tar.xz
 ### rename 重命名
 mv node-v6.10.0 node 
 ### gloab node and npm use 全局node和npm使用

 cd ~ && vim .bash_profile 
 add this . be sure url is right /下面这些添加进入文件保存推出 
       # .bash_profile

       # Get the aliases and functions
       if [ -f ~/.bashrc ]; then
               . ~/.bashrc
       fi

       # User specific environment and startup programs

       # PATH=$PATH:$HOME/bin:/usr/local/src/node/bin

       export PATH=/root/node/bin:$PATH
 ###  restart 重新启动文件，全局使用！搞定~
 source ./bash_profile

 ### node&npm updata /node npm升级
 npm install -g npm
 n stable （稳定版）/ n latest （最新版） {select one}

### macos redis 安装
 brew search redis 
 brew services start redis4.0
 ### linux
wget http://download.redis.io/releases/redis-4.0.6.tar.gz
tar xzf redis-4.0.6.tar.gz
cd redis-4.0.6
make
yum -y install wget //如果没有wget
 yum -y install gcc

  yum install cpp  　　　
　yum install binutils　　　
　 yum install glibc-kernheaders　　　
　 yum install glibc-common　　　
　 yum install glibc-devel　　　
// 参考链接
https://blog.csdn.net/fyihdg/article/details/79131879
