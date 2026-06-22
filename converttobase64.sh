node -e "require('fs').writeFileSync('copy_me.txt', 'data:image/png;base64,' + require('fs').readFileSync('./icon.png').toString('base64'))"
