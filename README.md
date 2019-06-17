
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
