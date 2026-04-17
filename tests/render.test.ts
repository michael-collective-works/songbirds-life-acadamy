import {describe, it, expect, beforeAll} from 'vitest'
import {readFileSync, existsSync} from 'node:fs'
import {load} from 'cheerio'

let $: ReturnType<typeof load>

beforeAll(() => {
  const distIndex = 'dist/index.html'

  if (!existsSync(distIndex)) {
    throw new Error(`${distIndex} missing — run "pnpm build" before "vitest run". The "pnpm test" script does this automatically.`)
  }

  const html = readFileSync(distIndex, 'utf8')
  $ = load(html)
})

describe('rendered index.html', () => {
  it('contains the tagline', () => {
    expect($('body').text()).toContain('immersed in music')
  })

  it('links to the Google inquiry form, opening in a new tab with rel noopener', () => {
    const forms = $('a[href*="docs.google.com/forms"]')

    expect(forms.length).toBeGreaterThanOrEqual(1)

    forms.each((_, el) => {
      expect($(el).attr('target')).toBe('_blank')
      expect($(el).attr('rel')).toMatch(/noopener/)
    })
  })

  it('has a tap-to-call phone link', () => {
    const tel = $('a[href^="tel:"]')

    expect(tel.length).toBeGreaterThanOrEqual(1)
    expect(tel.first().attr('href')).toBe('tel:+12256357973')
  })

  it('renders key credentials in the unified grid', () => {
    const bodyText = $('body').text()

    expect(bodyText).toContain('Low Teacher-to-Child Ratios')
    expect(bodyText).toContain('Music & Movement Daily')
    expect(bodyText).toContain('Sensory-Rich Classrooms')
    expect(bodyText).toContain('Daily Photo Updates')
  })

  it('has an alt attribute on every image (empty allowed for decorative)', () => {
    $('img').each((_, el) => {
      const alt = $(el).attr('alt')
      expect(alt, `img missing alt attribute: ${$(el).attr('src')}`).toBeDefined()
    })
  })

  it('surfaces the Louisiana Department of Education license as a trust badge', () => {
    expect($('body').text()).toContain('Louisiana Dept. of Education')
  })
})
