import * as fs   from 'fs'
import * as path from 'path'

const appDir  = path.join(process.cwd(), 'app')
const srcDirs = ['app', 'components', 'lib']

// Collect all existing routes
function getRoutes(dir: string, base = ''): string[] {
  const routes: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
    if (entry.name === 'api') continue
    if (entry.isDirectory()) {
      const routeName = entry.name.replace(/^\(|\)$/g, '')
      routes.push(...getRoutes(
        path.join(dir, entry.name),
        `${base}/${routeName}`
      ))
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
      routes.push(base || '/')
    }
  }
  return routes
}

// Find all href="..." values in source files
function findHrefs(dir: string): string[] {
  const hrefs: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      hrefs.push(...findHrefs(fullPath))
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      // Only capture absolute internal links starting with /
      const matches = content.match(/href=["']([/][^"'?#\s]*)/g) ?? []
      matches.forEach(m => {
        const href = m.replace(/href=["']/, '').replace(/["']$/, '')
        if (href.startsWith('/')) hrefs.push(href)
      })
    }
  }
  return hrefs
}

const routes = [...new Set(getRoutes(appDir))]
const hrefs  = [...new Set(findHrefs(process.cwd()))]

console.log('\n=== Routes found ===')
routes.forEach(r => console.log(r))

console.log('\n=== Broken hrefs ===')
hrefs.forEach(href => {
  if (href === '/' || href === '/#') return 
  
  // Normalize href for dynamic routes
  // This logic is simple, it can be refined if needed.
  const clean = href.split('/').map(part => {
    // Check if part looks like an ID/Slug (this is imprecise)
    // But audit logic provided says r === href or r === clean or href starts with r/
    return part
  }).join('/')

  const exists = routes.some(r => {
    if (r === href) return true
    
    // Dynamic matching like /team/[slug] matching /team/ismail
    const routeParts = r.split('/')
    const hrefParts  = href.split('/')
    
    if (routeParts.length !== hrefParts.length) return false
    
    return routeParts.every((part, i) => {
      return part.startsWith('[') || part === hrefParts[i]
    })
  })

  // Additionally check if it's a subroute of an existing route (e.g., /admin/members/cl... when /admin/members exists)
  // This is also a bit loose.
  
  if (!exists) {
    // Check for some common subroutes or catch-all
    const isSubroute = routes.some(r => href.startsWith(r + '/'))
    if (!isSubroute) console.log('BROKEN:', href)
  }
})
