import { readdirSync } from 'fs';

const put = []
readdirSync(__dirname).forEach(name => {
  name = name.replace(".md", '')
  put.push({ name, link: '/guide/shapes/' + name })
})

console.log(JSON.stringify(put))
