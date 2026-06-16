import '../report.css'

function WimpeyLogo() {
  return (
    <svg width="50" height="54" viewBox="0 0 50 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="25,2 49,52 1,52" fill="#555" />
      <text x="25" y="42" textAnchor="middle" fill="white" fontWeight="bold" fontSize="13" fontFamily="Arial">WL</text>
    </svg>
  )
}

export default function ReportPreview({ report, settings = {} }) {
  const isInterim = report.reportType === 'interim'
  const title = isInterim
    ? 'TEST REPORT ON COMPRESSIVE STRENGTH OF CONCRETE CUBE (Interim)'
    : 'TEST REPORT ON COMPRESSIVE STRENGTH OF CONCRETE CUBE'

  const labName   = settings.lab_name        ?? 'WIMPEY LABORATORIES L.L.C'
  const authName  = settings.authorized_name  ?? report.signedBy  ?? ''
  const authTitle = settings.authorized_title ?? report.position  ?? 'Lab Supervisor (Civil)'

  return (
    <div className="report-wrap">
      {/* ── Header ── */}
      {settings.header_image_url ? (
        <div className="rpt-header-img">
          <img src={settings.header_image_url} alt="Lab Header" style={{ width: '100%', display: 'block' }} />
        </div>
      ) : (
        <div className="rpt-header">
          <div className="rpt-company-left">
            <WimpeyLogo />
            <div>
              <div className="rpt-name-en">{labName}</div>
              <div className="rpt-location">MUSCAT</div>
            </div>
          </div>
          <div className="rpt-name-ar">مختبرات ويمبي ش.م.م</div>
        </div>
      )}

      {/* ── Title ── */}
      <div className="rpt-title">{title}</div>

      {/* ── Report Ref / Dates ── */}
      <table className="rpt-table">
        <tbody>
          <tr>
            <td className="rpt-lbl" style={{ width: '22%' }}>Wimpey Report Ref.</td>
            <td className="rpt-val" style={{ width: '28%' }}>: {report.labReportRef}</td>
            <td className="rpt-lbl" style={{ width: '22%' }}>Date Reported</td>
            <td className="rpt-val" style={{ width: '28%' }}>: {report.dateReported}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Client Request Ref.</td>
            <td className="rpt-val">: {report.clientRequestRef}</td>
            <td className="rpt-lbl">Date Received</td>
            <td className="rpt-val">: {report.dateReceived}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Information Provided By Client ── */}
      <table className="rpt-table" style={{ marginTop: 0 }}>
        <tbody>
          <tr className="rpt-section-hdr">
            <td colSpan="4">Information Provided By Client</td>
          </tr>
          <tr>
            <td className="rpt-lbl" style={{ width: '22%' }}>Wimpey Client</td>
            <td className="rpt-val" style={{ width: '28%' }}>: {report.clientName}</td>
            <td className="rpt-lbl" style={{ width: '22%' }}>Total No.of Cubes</td>
            <td className="rpt-val" style={{ width: '28%' }}>: {report.totalNoCubes}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Project</td>
            <td className="rpt-val">: {report.project}</td>
            <td className="rpt-lbl">Date of Casting</td>
            <td className="rpt-val">: {report.dateOfCasting}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Project Client</td>
            <td className="rpt-val">: {report.projectClient}</td>
            <td className="rpt-lbl">Sampled By</td>
            <td className="rpt-val">: {report.sampledBy}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Contractor</td>
            <td className="rpt-val">: {report.contractor}</td>
            <td className="rpt-lbl">Sampling Location</td>
            <td className="rpt-val">: {report.samplingLocation}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Consultant</td>
            <td className="rpt-val">: {report.consultant}</td>
            <td className="rpt-lbl">Sampling Cert.Ref</td>
            <td className="rpt-val">: {report.samplingCertRef}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Concrete Supplier</td>
            <td className="rpt-val">: {report.concreteSupplier}</td>
            <td className="rpt-lbl">Compaction Method</td>
            <td className="rpt-val">: {report.compactionMethod}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Mix Grade</td>
            <td className="rpt-val">: {report.mixGrade}</td>
            <td></td><td></td>
          </tr>
          <tr>
            <td className="rpt-lbl">Slump (mm)</td>
            <td className="rpt-val">: {report.slump}</td>
            <td></td><td></td>
          </tr>
          <tr>
            <td className="rpt-lbl">Air Content (%)</td>
            <td className="rpt-val">: {report.airContent}</td>
            <td></td><td></td>
          </tr>
          <tr>
            <td className="rpt-lbl">Sampling Method</td>
            <td className="rpt-val">: {report.samplingMethod}</td>
            <td></td><td></td>
          </tr>
          <tr>
            <td className="rpt-lbl">Other Information</td>
            <td className="rpt-val">: {report.otherInformation}</td>
            <td></td><td></td>
          </tr>
          <tr>
            <td className="rpt-lbl">Pour Location</td>
            <td className="rpt-val">: {report.pourLocation}</td>
            <td></td><td></td>
          </tr>
        </tbody>
      </table>

      {/* ── Laboratory Information ── */}
      <table className="rpt-table" style={{ marginTop: 0 }}>
        <tbody>
          <tr className="rpt-section-hdr">
            <td colSpan="4">Laboratory Information</td>
          </tr>
          <tr>
            <td className="rpt-lbl" style={{ width: '28%' }}>Laboratory Curing Method</td>
            <td className="rpt-val" style={{ width: '22%' }}>: {report.laboratoryCuringMethod}</td>
            <td className="rpt-lbl" style={{ width: '22%' }}>Cubes Delivered By</td>
            <td className="rpt-val" style={{ width: '28%' }}>: {report.cubesDeliveredBy}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Test Method</td>
            <td className="rpt-val">: {report.testMethod}</td>
            <td className="rpt-lbl">Dimensions</td>
            <td className="rpt-val">: {report.dimensions}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Density of Hardened Concrete-Method</td>
            <td className="rpt-val">: {report.densityMethod}</td>
            <td className="rpt-lbl">Nominal Size (mm)</td>
            <td className="rpt-val">: {report.nominalSize}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Volume Determination</td>
            <td className="rpt-val">: {report.volumeDetermination}</td>
            <td className="rpt-lbl">Removal of Fins</td>
            <td className="rpt-val">: {report.removalOfFins}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Test Location</td>
            <td className="rpt-val">: {report.testLocation}</td>
            <td className="rpt-lbl">Curing at Lab</td>
            <td className="rpt-val">: {report.curingAtLab}</td>
          </tr>
          <tr>
            <td className="rpt-lbl">Method Variation</td>
            <td className="rpt-val">: {report.methodVariation}</td>
            <td className="rpt-lbl">Tested By</td>
            <td className="rpt-val">: {report.testedBy}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Test Results ── */}
      <table className="rpt-table rpt-results" style={{ marginTop: 0 }}>
        <thead>
          <tr className="rpt-section-hdr">
            <td colSpan="15">Test Results</td>
          </tr>
          <tr>
            <th rowSpan="2" style={{ width: '7%' }}>Client<br />Ref.</th>
            <th rowSpan="2" style={{ width: '10%' }}>W Lab<br />Sample Ref</th>
            <th rowSpan="2" style={{ width: '5%' }}>Req.<br />Test<br />Age<br />(Days)</th>
            <th rowSpan="2" style={{ width: '5%' }}>Act.<br />Test<br />Age<br />(Days)</th>
            <th rowSpan="2" style={{ width: '8%' }}>Date of<br />Test</th>
            <th rowSpan="2" style={{ width: '7%' }}>Condition<br />Upon<br />Receipt</th>
            <th rowSpan="2" style={{ width: '7%' }}>Condition<br />@<br />Test</th>
            <th colSpan="3" style={{ width: '12%' }}>Measured<br />Dimensions<br />(mm) *</th>
            <th rowSpan="2" style={{ width: '6%' }}>Mass<br />(kg)</th>
            <th rowSpan="2" style={{ width: '7%' }}>Density<br />(kg/m³)</th>
            <th rowSpan="2" style={{ width: '7%' }}>Max.<br />Load @<br />Failure<br />(kN)</th>
            <th rowSpan="2" style={{ width: '7%' }}>Comp.<br />Strength<br />(N/mm²)</th>
            <th rowSpan="2" style={{ width: '7%' }}>Type of<br />Fracture</th>
          </tr>
          <tr>
            <th>L</th>
            <th>W</th>
            <th>H</th>
          </tr>
        </thead>
        <tbody>
          {report.testResults.map(row => (
            <tr key={row.id}>
              <td>{row.clientRef}</td>
              <td>{row.wLabSampleRef}</td>
              <td>{row.reqTestAge}</td>
              <td>{row.actTestAge}</td>
              <td>{row.dateOfTest}</td>
              <td>{row.conditionUponReceipt}</td>
              <td>{row.conditionAtTest}</td>
              <td>{row.dimL}</td>
              <td>{row.dimW}</td>
              <td>{row.dimH}</td>
              <td>{row.mass}</td>
              <td>{row.density}</td>
              <td>{row.maxLoad}</td>
              <td>{row.compStrength}</td>
              <td>{row.typeOfFracture}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Stamp: centered between results and notes (like original report) ── */}
      {settings.stamp_image_url && (
        <div className="rpt-stamp-area">
          <img src={settings.stamp_image_url} alt="Lab Stamp" className="rpt-stamp-img" />
        </div>
      )}

      {/* ── Notes & Legend ── */}
      <div className="rpt-footer-row">
        <div>
          <div>Note: &nbsp; {report.notes}</div>
          <div>Remarks : &nbsp; {report.remarks}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          SF:Satisfactory Failure, USF:Unsatisfactory Failure
        </div>
      </div>

      {/* ── Footer image OR drawn signature block ── */}
      {settings.footer_image_url ? (
        <div className="rpt-footer-img">
          <img src={settings.footer_image_url} alt="Lab Footer" />
        </div>
      ) : (
        <div className="rpt-sig-block">

          {/* Left: signature */}
          <div className="rpt-sig-left">
            <div className="rpt-sig-behalf">For and on behalf of {labName}, Muscat</div>
            {settings.signature_image_url && (
              <img src={settings.signature_image_url} alt="Signature" className="rpt-sig-img" />
            )}
            <div className="rpt-sig-name-block">
              <div className="rpt-sig-line" />
              <div><strong>{authName}</strong></div>
              <div>{authTitle}</div>
            </div>
          </div>

          {/* Right: legal box */}
          <div className="rpt-legal-box">
            This report shall only reproduced in full. Approval of the testing laboratory is required for partial reproduction.<br /><br />
            The test report relates only the samples tested. {labName} not responsible for &ldquo;Information Provided By Client&rdquo;.
          </div>

        </div>
      )}

      {/* ── Page Footer ── */}
      <div className="rpt-page-footer">
        <span>{report.certRef}</span>
        <span>END OF REPORT</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  )
}
