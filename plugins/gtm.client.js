export default defineNuxtPlugin(() => {
  const consent = useCookie('cookies_consent')

  const hasAnalyticsConsent = (value) => {
    return (
      value?.accepted === true &&
      Array.isArray(value?.cookies) &&
      value.cookies.includes('analytics')
    )
  }

  const loadGTM = () => {
    if (window.__gtmLoaded) return
    window.__gtmLoaded = true

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'gtm.js',
      'gtm.start': new Date().getTime(),
    })

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-K8S3MXF5'
    document.head.appendChild(script)
  }

  if (hasAnalyticsConsent(consent.value)) {
    loadGTM()
  }

  watch(
    () => consent.value,
    (newValue) => {
      if (hasAnalyticsConsent(newValue)) {
        loadGTM()
      }
    },
    { deep: true }
  )
})
