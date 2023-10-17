#!/bin/bash
npm run build
git add .

echo "Mensagem do commit: "
read message
git commit -am "$message"
git push
ssh 35.198.35.159 \
  'git -C /home/mauriciohbcorrea/api ' \
  'pull origin master && ' \
  'pm2 restart api && systemctl restart nginx'
