import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReportPreview from '../components/ReportPreview'
import api from '../utils/api'
import '../report.css'

function fmtDate(iso) {
  if (!iso) return ''
  const parts = iso.split('-')
  if (parts.length !== 3) return iso
  const [y, m, d] = parts
  return `${d}/${m}/${y}`
}

/* Map API field names → ReportPreview prop names */
function mapReport(r) {
  return {
    id:                    r.id,
    reportType:            r.report_type,
    labReportRef:          r.report_ref,
    clientRequestRef:      r.client_request_ref,
    dateReported:          fmtDate(r.date_reported),
    dateReceived:          fmtDate(r.date_received),
    clientName:            r.client_name,
    project:               r.project,
    projectClient:         r.project_client,
    contractor:            r.contractor,
    consultant:            r.consultant,
    concreteSupplier:      r.concrete_supplier,
    mixGrade:              r.mix_grade,
    slump:                 r.slump_mm,
    airContent:            r.air_content,
    samplingMethod:        r.sampling_method,
    otherInformation:      r.other_information,
    pourLocation:          r.pour_location,
    totalNoCubes:          r.total_cubes,
    dateOfCasting:         fmtDate(r.date_of_casting),
    sampledBy:             r.sampled_by,
    samplingLocation:      r.sampling_location,
    samplingCertRef:       r.sampling_cert_ref,
    compactionMethod:      r.compaction_method,
    laboratoryCuringMethod:r.lab_curing_method,
    testMethod:            r.test_method,
    densityMethod:         r.density_method,
    volumeDetermination:   r.volume_determination,
    testLocation:          r.test_location,
    methodVariation:       r.method_variation,
    cubesDeliveredBy:      r.cubes_delivered_by,
    dimensions:            r.dimensions,
    nominalSize:           r.nominal_size,
    removalOfFins:         r.removal_of_fins,
    curingAtLab:           r.curing_at_lab,
    testedBy:              r.tested_by,
    notes:                 '* Measured dimensions of cube were within 1% of nominal size.',
    remarks:               'None',
    signedBy:              r.setting?.authorized_name ?? '',
    position:              r.setting?.authorized_title ?? 'Lab Supervisor (Civil)',
    certRef:               'WLR-CV-001 Issue 1 Rev. 02',
    testResults: (r.test_results ?? []).map((t, i) => ({
      id:                   t.id ?? i,
      clientRef:            t.client_ref,
      wLabSampleRef:        t.lab_sample_ref,
      reqTestAge:           t.req_test_age,
      actTestAge:           t.act_test_age,
      dateOfTest:           fmtDate(t.date_of_test),
      conditionUponReceipt: t.condition_upon_receipt,
      conditionAtTest:      t.condition_at_test,
      dimL:                 t.dim_l,
      dimW:                 t.dim_w,
      dimH:                 t.dim_h,
      mass:                 t.mass_kg,
      density:              t.density,
      maxLoad:              t.max_load_kn,
      compStrength:         t.comp_strength,
      typeOfFracture:       t.type_of_fracture,
    })),
  }
}

export default function ViewReport() {
  const { id }                      = useParams()
  const [report, setReport]         = useState(null)
  const [settings, setSettings]     = useState({})
  const [loading, setLoading]       = useState(true)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get(`/reports/${id}`),
      api.get('/settings'),
    ]).then(([rRes, sRes]) => {
      setReport(mapReport(rRes.data))
      setSettings(sRes.data ?? {})
    }).finally(() => setLoading(false))
  }, [id])

  async function downloadPdf() {
    setPdfLoading(true)
    try {
      const res = await api.get(`/reports/${id}/pdf`, { responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `report-${report?.labReportRef || id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to generate PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  if (loading) return <div className="report-screen-bg flex items-center justify-center"><p className="text-white">Loading…</p></div>
  if (!report)  return <div className="p-8 text-gray-500">Report not found. <Link to="/" className="text-blue-600">Back</Link></div>

  return (
    <div className="report-screen-bg">
      <div className="report-screen-toolbar no-print">
        <Link to="/" className="px-4 py-2 bg-white text-slate-700 rounded-lg text-sm font-medium shadow hover:bg-slate-50">
          ← Dashboard
        </Link>
        <Link to={`/edit/${id}`} className="px-4 py-2 bg-white text-slate-700 rounded-lg text-sm font-medium shadow hover:bg-slate-50">
          Edit
        </Link>
        <button
          onClick={downloadPdf}
          disabled={pdfLoading}
          className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-red-700 disabled:opacity-60"
        >
          {pdfLoading ? 'Generating…' : '⬇ Download PDF'}
        </button>
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold shadow hover:bg-blue-800"
        >
          🖨 Print
        </button>
      </div>

      <ReportPreview report={report} settings={settings} />
    </div>
  )
}
