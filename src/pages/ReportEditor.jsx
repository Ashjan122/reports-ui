import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

function todayIso() {
  const d = new Date()
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const DEFAULTS = {
  report_type: 'final',
  report_ref: '', client_request_ref: '', date_reported: todayIso(), date_received: '',
  client_name: '', project: '', project_client: '',
  contractor: 'Not Given', consultant: 'Not Given', concrete_supplier: 'Not Given',
  mix_grade: 'C30 SRC', slump_mm: '120', air_content: 'Not Given',
  sampling_method: 'Not Given', other_information: 'Not Given', pour_location: '',
  total_cubes: 1, date_of_casting: '', sampled_by: 'Client',
  sampling_location: '', sampling_cert_ref: 'Not Given', compaction_method: 'Manual',
  lab_curing_method: 'BS EN 12390-2:2019', test_method: 'BS EN 12390-3:2019',
  density_method: 'BS EN 12390-7:2019', volume_determination: 'By Calculation',
  test_location: 'Wimpey Lab, Muscat', method_variation: 'None',
  cubes_delivered_by: 'Client', dimensions: 'Checked Nominal',
  nominal_size: '150X150X150', removal_of_fins: 'Manual-Using steel file',
  curing_at_lab: 'Water 20±2°C', tested_by: 'WL-1022',
  structural_reference: '',
  test_results: [{
    _key: 1, client_ref: '', lab_sample_ref: '',
    req_test_age: 28, act_test_age: 28, date_of_test: '',
    condition_upon_receipt: 'Normal', condition_at_test: 'Saturated',
    dim_l: 150, dim_w: 150, dim_h: 150,
    mass_kg: '', density: '', max_load_kn: '', comp_strength: '',
    type_of_fracture: 'SF',
  }],
}

function calcDensity(mass, l, w, h) {
  const m = parseFloat(mass), L = parseFloat(l), W = parseFloat(w), H = parseFloat(h)
  if (!m || !L || !W || !H) return ''
  return Math.round((m * 1e9) / (L * W * H))
}
function calcStrength(kn, l, w) {
  const k = parseFloat(kn), L = parseFloat(l), W = parseFloat(w)
  if (!k || !L || !W) return ''
  return ((k * 1000) / (L * W)).toFixed(1)
}

const inp = 'w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500'
const sel = 'w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-500'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  )
}

function Section({ title }) {
  return (
    <div className="col-span-2 bg-slate-700 text-white text-sm font-semibold px-3 py-1.5 rounded mt-3">
      {title}
    </div>
  )
}

export default function ReportEditor() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [data, setData] = useState(DEFAULTS)
  const [busy, setBusy] = useState(false)
  const [loadingReport, setLoadingReport] = useState(!!id)

  useEffect(() => {
    if (!id) return
    api.get(`/reports/${id}`).then(r => {
      const rep = r.data
      setData({
        ...DEFAULTS,
        ...rep,
        test_results: (rep.test_results ?? []).map((t, i) => ({ ...t, _key: t.id ?? i })),
      })
    }).finally(() => setLoadingReport(false))
  }, [id])

  function set(field, value) {
    setData(prev => ({ ...prev, [field]: value }))
  }

  function setRow(key, field, value) {
    setData(prev => {
      const rows = prev.test_results.map(r => {
        if (r._key !== key) return r
        const updated = { ...r, [field]: value }
        if (['mass_kg','dim_l','dim_w','dim_h'].includes(field)) {
          updated.density = calcDensity(
            field === 'mass_kg' ? value : r.mass_kg,
            field === 'dim_l'   ? value : r.dim_l,
            field === 'dim_w'   ? value : r.dim_w,
            field === 'dim_h'   ? value : r.dim_h,
          )
        }
        if (['max_load_kn','dim_l','dim_w'].includes(field)) {
          updated.comp_strength = calcStrength(
            field === 'max_load_kn' ? value : r.max_load_kn,
            field === 'dim_l'       ? value : r.dim_l,
            field === 'dim_w'       ? value : r.dim_w,
          )
        }
        return updated
      })
      return { ...prev, test_results: rows }
    })
  }

  function addRow() {
    const last = data.test_results.at(-1) ?? {}
    setData(prev => ({
      ...prev,
      test_results: [...prev.test_results, {
        _key: Date.now(), client_ref: last.client_ref ?? '',
        lab_sample_ref: '', req_test_age: '', act_test_age: '', date_of_test: '',
        condition_upon_receipt: last.condition_upon_receipt ?? 'Normal',
        condition_at_test: last.condition_at_test ?? 'Saturated',
        dim_l: last.dim_l ?? 150, dim_w: last.dim_w ?? 150, dim_h: last.dim_h ?? 150,
        mass_kg: '', density: '', max_load_kn: '', comp_strength: '', type_of_fracture: 'SF',
      }],
    }))
  }

  function removeRow(key) {
    if (data.test_results.length === 1) return
    setData(prev => ({ ...prev, test_results: prev.test_results.filter(r => r._key !== key) }))
  }

  async function handleSave() {
    setBusy(true)
    try {
      const payload = { ...data, test_results: data.test_results.map(({ _key, ...rest }) => rest) }
      const res = id
        ? await api.put(`/reports/${id}`, payload)
        : await api.post('/reports', payload)
      navigate(`/view/${res.data.id}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  if (loadingReport) return <div className="p-8 text-gray-400">Loading report…</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
          <h1 className="text-xl font-bold text-gray-800">{id ? 'Edit Report' : 'New Report'}</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</Link>
          <button onClick={handleSave} disabled={busy}
            className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50">
            {busy ? 'Saving…' : 'Save & Preview'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">

          <Section title="Report Information" />
          <Field label="Report Type">
            <div className="flex gap-4 mt-1">
              {['final','interim'].map(t => (
                <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="radio" name="report_type" value={t}
                    checked={data.report_type === t} onChange={() => set('report_type', t)} />
                  {t === 'final' ? 'Final' : 'Interim'}
                </label>
              ))}
            </div>
          </Field>
          <div />

          {[
            ['report_ref','Lab Report Ref.','e.g. MC12605760'],
            ['client_request_ref','Client Request Ref.','e.g. ID 3010'],
          ].map(([f, lbl, ph]) => (
            <Field key={f} label={lbl}>
              <input className={inp} value={data[f] ?? ''} onChange={e => set(f, e.target.value)} placeholder={ph} />
            </Field>
          ))}
          {[
            ['date_reported','Date Reported'],
            ['date_received','Date Received'],
          ].map(([f, lbl]) => (
            <Field key={f} label={lbl}>
              <input type="date" className={inp} value={data[f] ?? ''} onChange={e => set(f, e.target.value)} />
            </Field>
          ))}

          <Section title="Information Provided By Client" />

          {[
            ['client_name','Client Name','Rimal Al Kahlah Trading'],
            ['total_cubes','Total No. of Cubes','1'],
            ['project','Project',''],
          ].map(([f, lbl, ph]) => (
            <Field key={f} label={lbl}>
              <input className={inp} value={data[f] ?? ''} onChange={e => set(f, e.target.value)} placeholder={ph} />
            </Field>
          ))}
          <Field label="Date of Casting">
            <input type="date" className={inp} value={data.date_of_casting ?? ''} onChange={e => set('date_of_casting', e.target.value)} />
          </Field>
          {[
            ['project_client','Project Client',''],
            ['sampled_by','Sampled By','Client'],
            ['contractor','Contractor','Not Given'],
            ['sampling_location','Sampling Location',''],
            ['consultant','Consultant','Not Given'],
            ['sampling_cert_ref','Sampling Cert. Ref','Not Given'],
            ['concrete_supplier','Concrete Supplier','Not Given'],
            ['compaction_method','Compaction Method','Manual'],
            ['mix_grade','Mix Grade','C30 SRC'],
            ['slump_mm','Slump (mm)','120'],
            ['air_content','Air Content (%)','Not Given'],
            ['sampling_method','Sampling Method','Not Given'],
            ['other_information','Other Information','Not Given'],
            ['pour_location','Pour Location',''],
          ].map(([f, lbl, ph]) => (
            <Field key={f} label={lbl}>
              <input className={inp} value={data[f] ?? ''} onChange={e => set(f, e.target.value)} placeholder={ph} />
            </Field>
          ))}

          <Section title="Laboratory Information" />

          {[
            ['lab_curing_method','Lab Curing Method'],
            ['cubes_delivered_by','Cubes Delivered By'],
            ['test_method','Test Method'],
            ['dimensions','Dimensions'],
            ['density_method','Density Method'],
            ['nominal_size','Nominal Size (mm)'],
            ['volume_determination','Volume Determination'],
            ['removal_of_fins','Removal of Fins'],
            ['test_location','Test Location'],
            ['curing_at_lab','Curing at Lab'],
            ['method_variation','Method Variation'],
            ['tested_by','Tested By'],
          ].map(([f, lbl]) => (
            <Field key={f} label={lbl}>
              <input className={inp} value={data[f] ?? ''} onChange={e => set(f, e.target.value)} />
            </Field>
          ))}

          <div className="col-span-2 bg-slate-700 text-white text-sm font-semibold px-3 py-1.5 rounded mt-3">
            Test Results
          </div>
        </div>

        {/* Test Results Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                {['Client Ref.','W Lab Sample Ref','Req. Age','Act. Age','Date of Test',
                  'Cond. Receipt','Cond. @ Test','L (mm)','W (mm)','H (mm)',
                  'Mass (kg)','Density','Max Load (kN)','Strength','Fracture',''].map(h => (
                  <th key={h} className="border border-gray-300 px-2 py-1.5 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.test_results.map(row => (
                <tr key={row._key} className="hover:bg-gray-50">
                  {[['client_ref',18],['lab_sample_ref',24]].map(([f,w]) => (
                    <td key={f} className="border border-gray-200 p-0.5">
                      <input style={{width:w*4}} className="px-1.5 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={row[f] ?? ''} onChange={e => setRow(row._key, f, e.target.value)} />
                    </td>
                  ))}
                  {['req_test_age','act_test_age'].map(f => (
                    <td key={f} className="border border-gray-200 p-0.5">
                      <input type="number" className="w-12 text-center px-1 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={row[f] ?? ''} onChange={e => setRow(row._key, f, e.target.value)} />
                    </td>
                  ))}
                  <td className="border border-gray-200 p-0.5">
                    <input type="date" className="px-1 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={row.date_of_test ?? ''} onChange={e => setRow(row._key, 'date_of_test', e.target.value)} />
                  </td>
                  <td className="border border-gray-200 p-0.5">
                    <select className="px-1 py-1 text-xs bg-white rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={row.condition_upon_receipt} onChange={e => setRow(row._key, 'condition_upon_receipt', e.target.value)}>
                      <option>Normal</option><option>Damaged</option><option>Dry</option><option>Wet</option>
                    </select>
                  </td>
                  <td className="border border-gray-200 p-0.5">
                    <select className="px-1 py-1 text-xs bg-white rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={row.condition_at_test} onChange={e => setRow(row._key, 'condition_at_test', e.target.value)}>
                      <option>Saturated</option><option>Moist</option><option>Dry</option><option>Air Dry</option>
                    </select>
                  </td>
                  {['dim_l','dim_w','dim_h'].map(f => (
                    <td key={f} className="border border-gray-200 p-0.5">
                      <input type="number" className="w-14 text-center px-1 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={row[f] ?? ''} onChange={e => setRow(row._key, f, e.target.value)} />
                    </td>
                  ))}
                  <td className="border border-gray-200 p-0.5">
                    <input type="number" step="0.001" className="w-16 text-center px-1 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={row.mass_kg ?? ''} onChange={e => setRow(row._key, 'mass_kg', e.target.value)} />
                  </td>
                  <td className="border border-gray-200 p-0.5">
                    <input readOnly className="w-16 text-center px-1 py-1 text-xs bg-gray-50 rounded" value={row.density ?? ''} />
                  </td>
                  <td className="border border-gray-200 p-0.5">
                    <input type="number" step="0.1" className="w-16 text-center px-1 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={row.max_load_kn ?? ''} onChange={e => setRow(row._key, 'max_load_kn', e.target.value)} />
                  </td>
                  <td className="border border-gray-200 p-0.5">
                    <input readOnly className="w-16 text-center px-1 py-1 text-xs bg-gray-50 rounded" value={row.comp_strength ?? ''} />
                  </td>
                  <td className="border border-gray-200 p-0.5">
                    <select className="w-14 px-1 py-1 text-xs bg-white rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={row.type_of_fracture} onChange={e => setRow(row._key, 'type_of_fracture', e.target.value)}>
                      <option>SF</option><option>USF</option>
                    </select>
                  </td>
                  <td className="border border-gray-200 p-0.5 text-center">
                    <button onClick={() => removeRow(row._key)} disabled={data.test_results.length === 1}
                      className="text-red-400 hover:text-red-600 text-base leading-none disabled:opacity-30">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addRow} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Row</button>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Link to="/" className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</Link>
          <button onClick={handleSave} disabled={busy}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50">
            {busy ? 'Saving…' : 'Save & Preview →'}
          </button>
        </div>
      </div>
    </div>
  )
}
