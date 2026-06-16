import { useState, useEffect, useRef } from 'react'
import api from '../utils/api'

function ImageUploadField({ label, field, currentUrl, onChange }) {
  const inputRef = useRef()
  const [preview, setPreview] = useState(currentUrl || null)

  useEffect(() => { setPreview(currentUrl || null) }, [currentUrl])

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    onChange(field, file)
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      {preview ? (
        <div className="relative">
          <img src={preview} alt={label} className="w-full max-h-32 object-contain border rounded bg-gray-50" />
          <button onClick={() => { setPreview(null); onChange(field, null) }}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
            ×
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <span className="text-2xl mb-1">📁</span>
          <span className="text-xs text-gray-500">Click to upload image</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button onClick={() => inputRef.current.click()}
        className="text-xs text-blue-600 hover:underline self-start">
        {preview ? 'Change image' : 'Browse…'}
      </button>
    </div>
  )
}

export default function Settings() {
  const [form, setForm]     = useState({
    lab_name: '', lab_address: '', lab_phone: '', lab_email: '',
    authorized_name: '', authorized_title: '',
  })
  const [files, setFiles]   = useState({})
  const [urls, setUrls]     = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    api.get('/settings').then(r => {
      const d = r.data ?? {}
      setForm({
        lab_name:         d.lab_name         ?? '',
        lab_address:      d.lab_address       ?? '',
        lab_phone:        d.lab_phone         ?? '',
        lab_email:        d.lab_email         ?? '',
        authorized_name:  d.authorized_name   ?? '',
        authorized_title: d.authorized_title  ?? '',
      })
      setUrls({
        header_image:    d.header_image_url    ?? null,
        footer_image:    d.footer_image_url    ?? null,
        stamp_image:     d.stamp_image_url     ?? null,
        signature_image: d.signature_image_url ?? null,
      })
    }).finally(() => setLoading(false))
  }, [])

  function handleText(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleFileChange(field, file) {
    setFiles(prev => ({ ...prev, [field]: file }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''))
      Object.entries(files).forEach(([k, v]) => { if (v) fd.append(k, v) })

      const { data } = await api.post('/settings', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setUrls({
        header_image:    data.header_image_url    ?? null,
        footer_image:    data.footer_image_url    ?? null,
        stamp_image:     data.stamp_image_url     ?? null,
        signature_image: data.signature_image_url ?? null,
      })
      setFiles({})
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading…</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Lab Information */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4 pb-2 border-b">Laboratory Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['lab_name',         'Lab Name (English)',  'WIMPEY LABORATORIES L.L.C'],
              ['lab_address',      'Address',             'Muscat, Sultanate of Oman'],
              ['lab_phone',        'Phone',               ''],
              ['lab_email',        'Email',               ''],
              ['authorized_name',  'Authorized Signatory Name', 'Chandran Ramadasan'],
              ['authorized_title', 'Signatory Title',     'Lab Supervisor (Civil)'],
            ].map(([name, label, ph]) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleText}
                  placeholder={ph}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image Uploads */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-1 pb-2 border-b">Report Images</h2>
          <p className="text-xs text-gray-500 mb-4">
            Images appear in the PDF report. Recommended: header 190×50 mm, stamp/seal circular, footer 190×20 mm.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadField label="Header / Letterhead"   field="header_image"    currentUrl={urls.header_image}    onChange={handleFileChange} />
            <ImageUploadField label="Footer"                field="footer_image"    currentUrl={urls.footer_image}    onChange={handleFileChange} />
            <ImageUploadField label="Stamp / Seal"          field="stamp_image"     currentUrl={urls.stamp_image}     onChange={handleFileChange} />
            <ImageUploadField label="Signature"             field="signature_image" currentUrl={urls.signature_image} onChange={handleFileChange} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && <span className="text-emerald-600 text-sm font-medium">✓ Settings saved</span>}
        </div>
      </form>
    </div>
  )
}
