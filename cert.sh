
if [ $# -ne 2 ]; then
    echo "Usage: $0 <argument> <argument>"
    exit 1
fi

arg1="$1"
arg2="$2"

if [ "$arg2" == "prod" ]; then
  sudo certbot --apache -d $arg1;
else
  sudo echo $arg1 >> tmp;
fi
