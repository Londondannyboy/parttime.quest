'use client'

import { useState, useEffect, useRef } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'

const CONFIG_ID = 'd57ceb71-4cf5-47e9-87cd-6052445a031c'

// ALL 6 variables that the Quest prompt expects
interface TestVariables {
  first_name: string
  is_authenticated: string
  current_country: string
  interests: string
  timeline: string
  budget: string
}

function VoiceTest() {
  const { connect, disconnect, status, messages, sendSessionSettings, isMuted, mute, unmute } = useVoice()
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [micPermission, setMicPermission] = useState<string>('unknown')
  const connectionTime = useRef<number>(0)
  const firstMessageTime = useRef<number>(0)

  // Test variables - ALL 6 that the prompt expects
  const [testVars, setTestVars] = useState<TestVariables>({
    first_name: 'Dan',
    is_authenticated: 'true',
    current_country: 'United Kingdom',
    interests: 'CFO, CTO',
    timeline: 'Within 3 months',
    budget: '£1000-1500/day'
  })

  const log = (msg: string) => {
    console.log(msg)
    setLogs(prev => [...prev, `${new Date().toISOString().slice(11, 19)} - ${msg}`])
  }

  useEffect(() => {
    log('Fetching access token...')
    fetch('/api/hume-token')
      .then(res => res.json())
      .then(data => {
        if (data.accessToken) {
          log('✅ Got access token: ' + data.accessToken.slice(0, 20) + '...')
          setToken(data.accessToken)
        } else {
          log('❌ Error: No access token in response')
          setError('No access token')
        }
      })
      .catch(err => {
        log('❌ Error fetching token: ' + err.message)
        setError(err.message)
      })

    // Check mic permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        log('✅ Microphone permission granted')
        setMicPermission('granted')
      })
      .catch((err) => {
        log('❌ Microphone error: ' + err.message)
        setMicPermission('denied: ' + err.message)
      })
  }, [])

  // Log all incoming messages to catch warnings and track timing
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1] as any

      // Track first message timing (for race condition analysis)
      if (messages.length === 1 && connectionTime.current > 0) {
        firstMessageTime.current = Date.now()
        const delay = firstMessageTime.current - connectionTime.current
        log(`⏱️ First message received ${delay}ms after connect()`)
      }

      if (lastMsg.type === 'error' || lastMsg.type === 'warning' || lastMsg.code) {
        log(`⚠️ MESSAGE: type=${lastMsg.type}, code=${lastMsg.code || 'n/a'}`)
      }
      // Log chat_metadata specifically
      if (lastMsg.type === 'chat_metadata') {
        log(`📋 chat_metadata received: ${JSON.stringify(lastMsg).slice(0, 100)}...`)
      }
      // Log assistant messages to see if name is used
      if (lastMsg.type === 'assistant_message' && lastMsg.message?.content) {
        const content = lastMsg.message.content
        const hasName = content.toLowerCase().includes(testVars.first_name.toLowerCase())
        log(`🤖 Assistant: "${content.slice(0, 80)}..." ${hasName ? '✅ HAS NAME' : '❌ NO NAME'}`)
      }
    }
  }, [messages, testVars.first_name])

  // Method 1: Connect WITHOUT sessionSettings (baseline test)
  const handleConnectBasic = async () => {
    if (!token) {
      log('❌ No token available')
      return
    }

    log('🔄 METHOD 1: Connecting WITHOUT sessionSettings (baseline)...')
    log(`Config ID: ${CONFIG_ID}`)
    connectionTime.current = Date.now()

    try {
      await connect({
        auth: { type: 'accessToken', value: token },
        configId: CONFIG_ID
      })
      log('✅ Connected! Greeting should use raw {{first_name}} placeholder')
    } catch (err: any) {
      log('❌ Connect error: ' + (err?.message || JSON.stringify(err)))
      setError(err?.message || String(err))
    }
  }

  // Method 2: Connect WITH ALL 6 variables at connect time (THE FIX!)
  const handleConnectWithAllVars = async () => {
    if (!token) {
      log('❌ No token available')
      return
    }

    // ALL 6 variables that the Quest prompt expects
    const sessionSettings = {
      type: 'session_settings' as const,
      variables: {
        first_name: testVars.first_name,
        is_authenticated: testVars.is_authenticated,
        current_country: testVars.current_country,
        interests: testVars.interests,
        timeline: testVars.timeline,
        budget: testVars.budget
      }
    }

    log('🔄 METHOD 2: Connecting WITH ALL 6 VARIABLES at connect time...')
    log(`Config ID: ${CONFIG_ID}`)
    log(`Variables: ${JSON.stringify(sessionSettings.variables)}`)
    connectionTime.current = Date.now()

    try {
      await connect({
        auth: { type: 'accessToken', value: token },
        configId: CONFIG_ID,
        sessionSettings,
      })
      log('✅ Connected with variables! Greeting should say "Hey Dan!"')
    } catch (err: any) {
      log('❌ Connect error: ' + (err?.message || JSON.stringify(err)))
      setError(err?.message || String(err))
    }
  }

  // Method 3: Connect, wait for chat_metadata, THEN send (race condition test)
  const handleConnectThenSend = async () => {
    if (!token) {
      log('❌ No token available')
      return
    }

    log('🔄 METHOD 3: Connect first, THEN send variables (race condition test)...')
    log(`Config ID: ${CONFIG_ID}`)
    log(`This tests if sending after connect is too late...`)
    connectionTime.current = Date.now()

    try {
      await connect({
        auth: { type: 'accessToken', value: token },
        configId: CONFIG_ID
      })
      log('✅ Connected! Now waiting 500ms then sending variables...')

      // Wait a bit to simulate the delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Send ALL 6 variables
      const settings = {
        type: 'session_settings' as const,
        variables: {
          first_name: testVars.first_name,
          is_authenticated: testVars.is_authenticated,
          current_country: testVars.current_country,
          interests: testVars.interests,
          timeline: testVars.timeline,
          budget: testVars.budget
        }
      }
      log(`Sending post-connect: ${JSON.stringify(settings.variables)}`)
      sendSessionSettings(settings as any)
      log('✅ Variables sent AFTER connect - greeting probably already spoken without name!')
    } catch (err: any) {
      log('❌ Connect error: ' + (err?.message || JSON.stringify(err)))
      setError(err?.message || String(err))
    }
  }

  // Method 4: Test with is_authenticated = false (unauthenticated flow)
  const handleConnectUnauthenticated = async () => {
    if (!token) {
      log('❌ No token available')
      return
    }

    const sessionSettings = {
      type: 'session_settings' as const,
      variables: {
        first_name: '',
        is_authenticated: 'false',
        current_country: '',
        interests: '',
        timeline: '',
        budget: ''
      }
    }

    log('🔄 METHOD 4: Connecting as UNAUTHENTICATED user...')
    log(`Variables: ${JSON.stringify(sessionSettings.variables)}`)
    connectionTime.current = Date.now()

    try {
      await connect({
        auth: { type: 'accessToken', value: token },
        configId: CONFIG_ID,
        sessionSettings,
      })
      log('✅ Connected! Should get generic greeting for unauthenticated user')
    } catch (err: any) {
      log('❌ Connect error: ' + (err?.message || JSON.stringify(err)))
      setError(err?.message || String(err))
    }
  }

  const handleDisconnect = () => {
    log('🔄 Disconnecting...')
    disconnect()
    log('✅ Disconnected')
  }

  const clearLogs = () => setLogs([])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Hume Voice Debug Test</h1>

        {/* Status Panel */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h2 className="font-semibold mb-2 text-yellow-400">Status</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Connection: <span className={`font-mono ${status.value === 'connected' ? 'text-green-400' : 'text-red-400'}`}>{status.value}</span></div>
            <div>Token: <span className="font-mono">{token ? '✅ Ready' : '⏳ Loading...'}</span></div>
            <div>Microphone: <span className={`font-mono ${micPermission === 'granted' ? 'text-green-400' : 'text-red-400'}`}>{micPermission}</span></div>
            <div>Muted: <span className={`font-mono ${isMuted ? 'text-yellow-400' : 'text-green-400'}`}>{isMuted ? 'YES' : 'NO'}</span></div>
            <div>Config: <span className="font-mono text-xs">{CONFIG_ID}</span></div>
            <div>Messages: <span className="font-mono">{messages.length}</span></div>
          </div>
          {error && <p className="text-red-400 mt-2">Error: {error}</p>}
        </div>

        {/* Test Variables Input - ALL 6 */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h2 className="font-semibold mb-3 text-yellow-400">Test Variables (All 6 for Quest prompt)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <label className="block text-gray-400 mb-1">first_name</label>
              <input
                type="text"
                value={testVars.first_name}
                onChange={(e) => setTestVars(v => ({ ...v, first_name: e.target.value }))}
                className="bg-gray-700 px-3 py-2 rounded text-white w-full"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">is_authenticated</label>
              <select
                value={testVars.is_authenticated}
                onChange={(e) => setTestVars(v => ({ ...v, is_authenticated: e.target.value }))}
                className="bg-gray-700 px-3 py-2 rounded text-white w-full"
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">current_country</label>
              <input
                type="text"
                value={testVars.current_country}
                onChange={(e) => setTestVars(v => ({ ...v, current_country: e.target.value }))}
                className="bg-gray-700 px-3 py-2 rounded text-white w-full"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">interests</label>
              <input
                type="text"
                value={testVars.interests}
                onChange={(e) => setTestVars(v => ({ ...v, interests: e.target.value }))}
                className="bg-gray-700 px-3 py-2 rounded text-white w-full"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">timeline</label>
              <input
                type="text"
                value={testVars.timeline}
                onChange={(e) => setTestVars(v => ({ ...v, timeline: e.target.value }))}
                className="bg-gray-700 px-3 py-2 rounded text-white w-full"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">budget</label>
              <input
                type="text"
                value={testVars.budget}
                onChange={(e) => setTestVars(v => ({ ...v, budget: e.target.value }))}
                className="bg-gray-700 px-3 py-2 rounded text-white w-full"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h2 className="font-semibold mb-3 text-yellow-400">Test Methods</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleConnectBasic}
              disabled={!token || status.value === 'connected'}
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-700 text-sm"
            >
              1. No Vars (baseline)
            </button>
            <button
              onClick={handleConnectWithAllVars}
              disabled={!token || status.value === 'connected'}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 text-sm font-bold"
            >
              2. ALL 6 Vars at Connect ⭐
            </button>
            <button
              onClick={handleConnectThenSend}
              disabled={!token || status.value === 'connected'}
              className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50 hover:bg-orange-700 text-sm"
            >
              3. Send AFTER Connect
            </button>
            <button
              onClick={handleConnectUnauthenticated}
              disabled={!token || status.value === 'connected'}
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50 hover:bg-purple-700 text-sm"
            >
              4. Unauthenticated
            </button>
            <button
              onClick={handleDisconnect}
              disabled={status.value !== 'connected'}
              className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 hover:bg-red-700 text-sm"
            >
              Disconnect
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
            >
              Clear Logs
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Method 2 (green) is the FIX - passes all variables at connect time so greeting can use them.
          </p>
        </div>

        {/* Logs Panel - FULL WIDTH */}
        <div className="bg-black rounded-lg p-4 font-mono text-sm mb-4">
          <h2 className="text-yellow-400 mb-2">Logs ({logs.length}):</h2>
          <div className="h-80 overflow-auto space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="text-green-400 whitespace-pre-wrap break-all">{log}</div>
            ))}
            {logs.length === 0 && <div className="text-gray-600">No logs yet...</div>}
          </div>
        </div>

        {/* Messages Panel */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="font-semibold mb-2 text-yellow-400">Messages ({messages.length})</h2>
          <div className="max-h-48 overflow-auto text-sm space-y-2">
            {messages.slice(-10).map((msg: any, i) => (
              <div key={i} className="bg-gray-700 p-2 rounded">
                <span className="font-mono text-xs text-purple-400">{msg.type}</span>
                {msg.message?.content && (
                  <p className="text-gray-300 mt-1">{msg.message.content}</p>
                )}
              </div>
            ))}
            {messages.length === 0 && <div className="text-gray-600">No messages yet...</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestHumePage() {
  return (
    <VoiceProvider>
      <VoiceTest />
    </VoiceProvider>
  )
}
