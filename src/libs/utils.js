export const toggleTheme = (theme, oldTheme) => {
  const body = document.getElementsByTagName('body')[0]

  if (body.classList.contains('theme-' + oldTheme))
    body.classList.remove('theme-' + oldTheme)

  body.classList.add('theme-' + theme)

  return { theme }
}
