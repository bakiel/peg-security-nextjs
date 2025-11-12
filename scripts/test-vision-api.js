/**
 * Test Vision AI API
 *
 * Tests all AI vision endpoints with sample images
 */

const API_BASE = 'http://localhost:3002'

// Sample test images (public URLs)
const TEST_IMAGES = {
  // Security camera installation
  security: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
  // Professional headshot
  headshot: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  // Document/CV sample
  document: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800'
}

async function testAPI(action, imageUrl, description) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🧪 Testing: ${description}`)
  console.log(`Action: ${action}`)
  console.log(`Image: ${imageUrl}`)
  console.log(`${'='.repeat(60)}`)

  try {
    const startTime = Date.now()

    const response = await fetch(`${API_BASE}/api/vision/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageUrl,
        action
      })
    })

    const elapsed = Date.now() - startTime

    if (!response.ok) {
      const error = await response.json()
      console.error(`❌ FAILED (${response.status}):`, error)
      return false
    }

    const data = await response.json()
    console.log(`✅ SUCCESS (${elapsed}ms)`)
    console.log('📊 Result:', JSON.stringify(data.result, null, 2))

    return true
  } catch (error) {
    console.error('❌ ERROR:', error.message)
    return false
  }
}

async function testCustomPrompt() {
  console.log(`\n${'='.repeat(60)}`)
  console.log('🧪 Testing: Custom Prompt')
  console.log(`${'='.repeat(60)}`)

  try {
    const startTime = Date.now()

    const response = await fetch(`${API_BASE}/api/vision/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageUrl: TEST_IMAGES.security,
        action: 'custom',
        prompt: 'What type of security equipment is visible in this image? Be specific about brands and models if identifiable.'
      })
    })

    const elapsed = Date.now() - startTime

    if (!response.ok) {
      const error = await response.json()
      console.error(`❌ FAILED (${response.status}):`, error)
      return false
    }

    const data = await response.json()
    console.log(`✅ SUCCESS (${elapsed}ms)`)
    console.log('📊 Result:', data.result.analysis)

    return true
  } catch (error) {
    console.error('❌ ERROR:', error.message)
    return false
  }
}

async function runAllTests() {
  console.log('\n')
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║         🤖 PEG SECURITY - VISION AI API TESTS 🤖         ║')
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║  Model: Gemini 2.0 Flash Experimental (FREE)             ║')
  console.log('║  Provider: OpenRouter                                     ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  const results = []

  // Test 1: Gallery Auto-Description
  results.push(
    await testAPI(
      'gallery',
      TEST_IMAGES.security,
      'Gallery Auto-Description (Security Installation)'
    )
  )

  // Test 2: Alt Text Generation
  results.push(
    await testAPI(
      'altText',
      TEST_IMAGES.security,
      'Alt Text Generation'
    )
  )

  // Test 3: Image Quality Analysis
  results.push(
    await testAPI(
      'quality',
      TEST_IMAGES.security,
      'Image Quality Analysis'
    )
  )

  // Test 4: SEO Keywords
  results.push(
    await testAPI(
      'seo',
      TEST_IMAGES.security,
      'SEO Keywords Generation'
    )
  )

  // Test 5: Security Equipment Identification
  results.push(
    await testAPI(
      'equipment',
      TEST_IMAGES.security,
      'Security Equipment Identification'
    )
  )

  // Test 6: Application Photo Validation
  results.push(
    await testAPI(
      'photo',
      TEST_IMAGES.headshot,
      'Application Photo Validation (Headshot)'
    )
  )

  // Test 7: CV Parsing
  results.push(
    await testAPI(
      'cv',
      TEST_IMAGES.document,
      'CV/Resume Parsing'
    )
  )

  // Test 8: Custom Prompt
  results.push(await testCustomPrompt())

  // Summary
  console.log(`\n${'='.repeat(60)}`)
  console.log('📊 TEST SUMMARY')
  console.log(`${'='.repeat(60)}`)

  const passed = results.filter(r => r).length
  const total = results.length

  console.log(`✅ Passed: ${passed}/${total}`)
  console.log(`❌ Failed: ${total - passed}/${total}`)

  if (passed === total) {
    console.log('\n🎉 ALL TESTS PASSED! Vision AI is fully operational.')
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.')
  }

  console.log('\n✨ Vision AI Features Available:')
  console.log('   • Gallery auto-description')
  console.log('   • Alt text generation')
  console.log('   • Image quality analysis')
  console.log('   • SEO keywords extraction')
  console.log('   • Security equipment identification')
  console.log('   • Application photo validation')
  console.log('   • CV/Resume parsing')
  console.log('   • PSIRA certificate verification')
  console.log('   • Custom image analysis\n')
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Test suite failed:', error)
  process.exit(1)
})
