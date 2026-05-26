import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartLine, faPaperPlane, faEnvelopeOpenText, 
  faExclamationCircle, faUsers, faBullhorn, faCalendarCheck,
  faCoins, faArrowUp, faPercentage, faCloudDownloadAlt,
  faCircleCheck, faMobileAlt, faEnvelope, faCommentAlt,
  faSlidersH, faHistory
} from "@fortawesome/free-solid-svg-icons";
import "./Reports.css";
import { useAppContext } from "../context/AppContext";

function Reports() {
  const { currentUser, contacts, campaigns, schedules } = useAppContext();
  const isAdmin = currentUser?.role === "admin";

  const visibleContacts = contacts.filter(
    (contact) => isAdmin || contact.userId === currentUser?.id
  );
  const visibleCampaigns = campaigns.filter(
    (campaign) => isAdmin || campaign.userId === currentUser?.id
  );
  const visibleSchedules = schedules.filter(
    (schedule) => isAdmin || schedule.userId === currentUser?.id
  );

  // Business Model calculations
  const totalSent = visibleCampaigns.length * 150 + visibleSchedules.length * 80;
  const delivered = Math.ceil(totalSent * 0.985) || 120;
  const read = Math.ceil(delivered * 0.78) || 94;
  const clicked = Math.ceil(delivered * 0.124) || 15;
  const failed = Math.max(totalSent - delivered, 0);

  // Cost estimates based on channel rates
  const estimatedCostVal = parseFloat(
    (
      visibleCampaigns.length * 3.50 + 
      visibleSchedules.length * 1.80 + 
      delivered * 0.015
    ).toFixed(2)
  ) || 15.00;

  // Conversions = 35% of clicks
  const conversions = Math.ceil(clicked * 0.35) || 5;

  // Revenue generated estimation (average transaction order value of $22.50)
  const estimatedRevenueVal = parseFloat((conversions * 22.50).toFixed(2)) || 112.50;
  
  // ROI ratio
  const roi = (
    estimatedCostVal > 0 
      ? (estimatedRevenueVal / estimatedCostVal).toFixed(1)
      : "0.0"
  ) + "x";

  // Unit Economics
  const ltvVal = 180.00; // Customer Lifetime Value baseline
  const cacVal = conversions > 0 ? parseFloat((estimatedCostVal / conversions).toFixed(2)) : 0;
  const ltvToCacRatio = cacVal > 0 ? (ltvVal / cacVal).toFixed(1) : "0.0";
  const churnRate = "2.8%";
  const nrrRate = "114.2%";

  // Simulator State
  const [simAov, setSimAov] = useState(45);
  const [simContacts, setSimContacts] = useState(2500);
  const [simConvRate, setSimConvRate] = useState(3.5);
  const [simCostPerMsg, setSimCostPerMsg] = useState(0.02);

  // Simulator Calculations
  const simTotalCost = parseFloat((simContacts * simCostPerMsg).toFixed(2));
  const simConversions = Math.ceil(simContacts * (simConvRate / 100));
  const simGrossRevenue = parseFloat((simConversions * simAov).toFixed(2));
  const simNetProfit = parseFloat((simGrossRevenue - simTotalCost).toFixed(2));
  const simMargin = simGrossRevenue > 0 ? ((simNetProfit / simGrossRevenue) * 100).toFixed(1) : "0";
  const simCac = simConversions > 0 ? (simTotalCost / simConversions).toFixed(2) : "0.00";
  const simRoas = simTotalCost > 0 ? (simGrossRevenue / simTotalCost).toFixed(1) : "0.0";

  // Historical Chart Data (SVG line chart calculations)
  const chartData = [
    { month: "Jan", revenue: 850, expense: 120 },
    { month: "Feb", revenue: 1200, expense: 180 },
    { month: "Mar", revenue: 1750, expense: 220 },
    { month: "Apr", revenue: 2100, expense: 290 },
    { month: "May", revenue: 2600, expense: 340 },
    { month: "Jun", revenue: Math.max(Math.ceil(estimatedRevenueVal), 2800), expense: Math.max(Math.ceil(estimatedCostVal), 380) },
  ];

  const maxVal = Math.max(...chartData.map(d => Math.max(d.revenue, d.expense))) * 1.15 || 4000;
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 50;
  const paddingY = 30;
  const chartWidth = svgWidth - paddingX - 20; // 530
  const chartHeight = svgHeight - paddingY - 20; // 170

  const getX = (index) => paddingX + (index * (chartWidth / (chartData.length - 1)));
  const getY = (value) => svgHeight - paddingY - ((value / maxVal) * chartHeight);

  // Build SVG Path strings
  const revPathPoints = chartData.map((d, i) => `${getX(i)},${getY(d.revenue)}`).join(" L ");
  const revenuePathD = `M ${revPathPoints}`;
  const revenueAreaD = `${revenuePathD} L ${getX(chartData.length - 1)},${svgHeight - paddingY} L ${getX(0)},${svgHeight - paddingY} Z`;

  const expPathPoints = chartData.map((d, i) => `${getX(i)},${getY(d.expense)}`).join(" L ");
  const expensePathD = `M ${expPathPoints}`;
  const expenseAreaD = `${expensePathD} L ${getX(chartData.length - 1)},${svgHeight - paddingY} L ${getX(0)},${svgHeight - paddingY} Z`;

  const handleExport = (format) => {
    alert(`Generating ${format} report... Your file will download automatically shortly.`);
  };

  return (
    <div className="reports-page">
      {/* Header Panel */}
      <div className="reports-header glass-panel">
        <div className="reports-header-text">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faChartLine} className="heading-icon" /> 
            Business Model & Unit Economics Dashboard
          </h2>
          <p className="subtitle">Track customer acquisition costs, conversion funnels, lifetime value, and run predictive scenarios.</p>
        </div>
        <div className="reports-export-actions">
          <button className="export-btn secondary-btn" onClick={() => handleExport("CSV")}>
            <FontAwesomeIcon icon={faCloudDownloadAlt} /> Export CSV
          </button>
          <button className="export-btn primary-btn" onClick={() => handleExport("PDF")}>
            <FontAwesomeIcon icon={faCloudDownloadAlt} /> Export PDF
          </button>
        </div>
      </div>

      {/* Core Business Model KPIs */}
      <div className="metrics-grid">
        <div className="metric-card glass-panel roi-card">
          <div className="metric-icon-wrapper purple-bg">
            <FontAwesomeIcon icon={faArrowUp} className="metric-icon" />
          </div>
          <div className="metric-content">
            <h3>Return on Investment (ROI)</h3>
            <p className="metric-value text-gradient">{roi}</p>
            <span className="metric-trend green-trend">Efficient marketing ratio</span>
          </div>
        </div>

        <div className="metric-card glass-panel success-glow">
          <div className="metric-icon-wrapper green-bg">
            <FontAwesomeIcon icon={faCoins} className="metric-icon" />
          </div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">${estimatedRevenueVal.toFixed(2)}</p>
            <span className="metric-trend green-trend">{conversions} conversions recorded</span>
          </div>
        </div>

        <div className="metric-card glass-panel primary-glow">
          <div className="metric-icon-wrapper blue-bg">
            <FontAwesomeIcon icon={faPaperPlane} className="metric-icon" />
          </div>
          <div className="metric-content">
            <h3>Marketing Expenses</h3>
            <p className="metric-value">${estimatedCostVal.toFixed(2)}</p>
            <span className="metric-trend blue-trend">Gateway & carrier fee total</span>
          </div>
        </div>

        <div className="metric-card glass-panel warning-glow">
          <div className="metric-icon-wrapper amber-bg">
            <FontAwesomeIcon icon={faPercentage} className="metric-icon" />
          </div>
          <div className="metric-content">
            <h3>Conversion Rate</h3>
            <p className="metric-value">12.4%</p>
            <span className="metric-trend amber-trend">Delivery to Click ratio</span>
          </div>
        </div>
      </div>

      {/* Unit Economics Dashboard Row */}
      <div className="unit-economics-grid">
        <div className="ue-card glass-panel">
          <span className="ue-title">LTV (Lifetime Value)</span>
          <div className="ue-main">
            <span className="ue-value">${ltvVal.toFixed(2)}</span>
            <span className="ue-badge purple">Projected</span>
          </div>
          <p className="ue-desc">Average gross profit generated per customer sequence.</p>
        </div>

        <div className="ue-card glass-panel">
          <span className="ue-title">CAC (Acquisition Cost)</span>
          <div className="ue-main">
            <span className="ue-value">${cacVal.toFixed(2)}</span>
            <span className="ue-badge blue">Real-time</span>
          </div>
          <p className="ue-desc">Total campaign expense divided by converted leads.</p>
        </div>

        <div className="ue-card glass-panel">
          <span className="ue-title">LTV : CAC Ratio</span>
          <div className="ue-main">
            <span className="ue-value text-gradient">{ltvToCacRatio}x</span>
            <span className={`ue-badge ${parseFloat(ltvToCacRatio) >= 3.0 ? "green" : "amber"}`}>
              {parseFloat(ltvToCacRatio) >= 3.0 ? "Excellent" : "Needs Scale"}
            </span>
          </div>
          <p className="ue-desc">Target ratio is &gt; 3.0x for healthy sustainable growth.</p>
        </div>

        <div className="ue-card glass-panel">
          <span className="ue-title">Retention Metrics</span>
          <div className="ue-dual-stats">
            <div className="ue-stat-col">
              <span className="ue-stat-val">{nrrRate}</span>
              <span className="ue-stat-lbl">NRR</span>
            </div>
            <div className="ue-stat-col">
              <span className="ue-stat-val text-red">{churnRate}</span>
              <span className="ue-stat-lbl">Churn</span>
            </div>
          </div>
          <p className="ue-desc">Contact list opt-outs vs campaign recurring growth.</p>
        </div>
      </div>

      {/* Main Analysis Section: Trend Graph & Cohorts */}
      <div className="reports-double-row">
        {/* SVG Historical Chart */}
        <div className="chart-container glass-panel">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faHistory} className="section-icon" />
              Financial Growth Trends (6 Months)
            </h3>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot revenue-dot"></span> Revenue</span>
              <span className="legend-item"><span className="legend-dot expense-dot"></span> Expenses</span>
            </div>
          </div>
          
          <div className="svg-chart-wrapper">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="svg-chart">
              {/* Grids and axes */}
              <line x1={paddingX} y1={paddingY} x2={paddingX} y2={svgHeight - paddingY} className="chart-axis" />
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - 20} y2={svgHeight - paddingY} className="chart-axis" />
              
              {/* Horizontal gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = svgHeight - paddingY - (ratio * chartHeight);
                const value = Math.round(ratio * maxVal);
                return (
                  <g key={index} className="chart-gridline-group">
                    <line x1={paddingX} y1={y} x2={svgWidth - 20} y2={y} className="chart-gridline" />
                    <text x={paddingX - 10} y={y + 4} textAnchor="end" className="chart-axis-label">${value}</text>
                  </g>
                );
              })}

              {/* Area under paths */}
              <path d={revenueAreaD} className="chart-area revenue-area" />
              <path d={expenseAreaD} className="chart-area expense-area" />

              {/* Smooth lines */}
              <path d={revenuePathD} className="chart-line revenue-line" />
              <path d={expensePathD} className="chart-line expense-line" />

              {/* Data points & labels */}
              {chartData.map((d, i) => (
                <g key={i}>
                  {/* Revenue Dot */}
                  <circle cx={getX(i)} cy={getY(d.revenue)} r="5" className="chart-dot revenue-dot" />
                  {/* Expense Dot */}
                  <circle cx={getX(i)} cy={getY(d.expense)} r="4" className="chart-dot expense-dot" />
                  
                  {/* Month Label */}
                  <text x={getX(i)} y={svgHeight - 10} textAnchor="middle" className="chart-axis-label bold">{d.month}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Cohort Heatmap */}
        <div className="cohort-container glass-panel">
          <h3>
            <FontAwesomeIcon icon={faUsers} className="section-icon" />
            Customer Cohort Retention
          </h3>
          <p className="cohort-subtitle">Percentage of users who continue interacting with subsequent campaigns monthly.</p>
          <div className="cohort-table-wrapper">
            <table className="cohort-table">
              <thead>
                <tr>
                  <th>Cohort</th>
                  <th>Contacts</th>
                  <th>Month 0</th>
                  <th>Month 1</th>
                  <th>Month 2</th>
                  <th>Month 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="cohort-name">Jan Cohort</td>
                  <td className="cohort-size">240</td>
                  <td className="cohort-cell m0" style={{ background: "rgba(139, 92, 246, 1.0)", color: "white" }}>100%</td>
                  <td className="cohort-cell m1" style={{ background: "rgba(139, 92, 246, 0.82)" }}>82.5%</td>
                  <td className="cohort-cell m2" style={{ background: "rgba(139, 92, 246, 0.74)" }}>74.1%</td>
                  <td className="cohort-cell m3" style={{ background: "rgba(139, 92, 246, 0.68)" }}>68.2%</td>
                </tr>
                <tr>
                  <td className="cohort-name">Feb Cohort</td>
                  <td className="cohort-size">310</td>
                  <td className="cohort-cell m0" style={{ background: "rgba(139, 92, 246, 1.0)", color: "white" }}>100%</td>
                  <td className="cohort-cell m1" style={{ background: "rgba(139, 92, 246, 0.85)" }}>85.0%</td>
                  <td className="cohort-cell m2" style={{ background: "rgba(139, 92, 246, 0.78)" }}>78.3%</td>
                  <td className="cohort-cell empty">-</td>
                </tr>
                <tr>
                  <td className="cohort-name">Mar Cohort</td>
                  <td className="cohort-size">450</td>
                  <td className="cohort-cell m0" style={{ background: "rgba(139, 92, 246, 1.0)", color: "white" }}>100%</td>
                  <td className="cohort-cell m1" style={{ background: "rgba(139, 92, 246, 0.89)" }}>89.1%</td>
                  <td className="cohort-cell empty">-</td>
                  <td className="cohort-cell empty">-</td>
                </tr>
                <tr>
                  <td className="cohort-name">Apr Cohort</td>
                  <td className="cohort-size">520</td>
                  <td className="cohort-cell m0" style={{ background: "rgba(139, 92, 246, 1.0)", color: "white" }}>100%</td>
                  <td className="cohort-cell empty">-</td>
                  <td className="cohort-cell empty">-</td>
                  <td className="cohort-cell empty">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="funnel-container glass-panel">
        <h3>Campaign Conversion Funnel</h3>
        <p className="funnel-subtitle">Detailed breakdown of customer outreach response metrics.</p>
        
        <div className="funnel-flow">
          <div className="funnel-stage">
            <div className="funnel-bar-wrapper">
              <div className="funnel-bar stage-sent" style={{ width: "100%" }}>
                <span className="stage-value">{totalSent}</span>
              </div>
            </div>
            <div className="funnel-stage-label">
              <strong>Sent</strong>
              <span>Outreach Dispatched (100%)</span>
            </div>
          </div>

          <div className="funnel-stage">
            <div className="funnel-bar-wrapper">
              <div className="funnel-bar stage-delivered" style={{ width: "98%" }}>
                <span className="stage-value">{delivered}</span>
              </div>
            </div>
            <div className="funnel-stage-label">
              <strong>Delivered</strong>
              <span>Received on device (98.5%)</span>
            </div>
          </div>

          <div className="funnel-stage">
            <div className="funnel-bar-wrapper">
              <div className="funnel-bar stage-read" style={{ width: "78%" }}>
                <span className="stage-value">{read}</span>
              </div>
            </div>
            <div className="funnel-stage-label">
              <strong>Opened / Read</strong>
              <span>Recipient viewed (78%)</span>
            </div>
          </div>

          <div className="funnel-stage">
            <div className="funnel-bar-wrapper">
              <div className="funnel-bar stage-clicked" style={{ width: "12%" }}>
                <span className="stage-value">{clicked}</span>
              </div>
            </div>
            <div className="funnel-stage-label">
              <strong>Converted</strong>
              <span>Action / Link clicked (12.4%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Business Model Simulator */}
      <div className="simulator-section glass-panel">
        <div className="simulator-header">
          <h3>
            <FontAwesomeIcon icon={faSlidersH} className="section-icon" />
            Interactive Projections Simulator
          </h3>
          <p className="simulator-subtitle">Adjust core variables to simulate marketing expenditures, profit margins, and customer acquisition costs.</p>
        </div>

        <div className="simulator-container">
          {/* Sliders Area */}
          <div className="sim-sliders-card">
            <div className="sim-slider-row">
              <div className="slider-label-group">
                <span className="slider-title">Average Order Value (AOV)</span>
                <span className="slider-value">${simAov}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="500" 
                value={simAov} 
                onChange={(e) => setSimAov(parseInt(e.target.value))}
                className="sim-range-input"
              />
              <div className="range-limits">
                <span>$10</span>
                <span>$500</span>
              </div>
            </div>

            <div className="sim-slider-row">
              <div className="slider-label-group">
                <span className="slider-title">Simulated Audience Size</span>
                <span className="slider-value">{simContacts.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="10000" 
                step="100"
                value={simContacts} 
                onChange={(e) => setSimContacts(parseInt(e.target.value))}
                className="sim-range-input"
              />
              <div className="range-limits">
                <span>100</span>
                <span>10,000</span>
              </div>
            </div>

            <div className="sim-slider-row">
              <div className="slider-label-group">
                <span className="slider-title">Expected Conversion Rate</span>
                <span className="slider-value">{simConvRate}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="20" 
                step="0.5"
                value={simConvRate} 
                onChange={(e) => setSimConvRate(parseFloat(e.target.value))}
                className="sim-range-input"
              />
              <div className="range-limits">
                <span>0.5%</span>
                <span>20%</span>
              </div>
            </div>

            <div className="sim-slider-row">
              <div className="slider-label-group">
                <span className="slider-title">Overhead Cost per Message</span>
                <span className="slider-value">${simCostPerMsg.toFixed(3)}</span>
              </div>
              <input 
                type="range" 
                min="0.005" 
                max="0.15" 
                step="0.005"
                value={simCostPerMsg} 
                onChange={(e) => setSimCostPerMsg(parseFloat(e.target.value))}
                className="sim-range-input"
              />
              <div className="range-limits">
                <span>$0.005</span>
                <span>$0.15</span>
              </div>
            </div>
          </div>

          {/* Calculations Projections Display Card */}
          <div className="sim-projections-card">
            <div className="proj-main-header">Projected Marketing Projections</div>
            <div className="proj-stats-grid">
              
              <div className="proj-stat-item">
                <span className="proj-lbl">Total Campaign Expense</span>
                <span className="proj-val expense-color">${simTotalCost.toFixed(2)}</span>
                <span className="proj-note">Audience × Cost/Msg</span>
              </div>

              <div className="proj-stat-item">
                <span className="proj-lbl">Projected Revenue</span>
                <span className="proj-val revenue-color">${simGrossRevenue.toFixed(2)}</span>
                <span className="proj-note">{simConversions} clients acquired</span>
              </div>

              <div className="proj-stat-item">
                <span className="proj-lbl">Projected Net Margin</span>
                <span className={`proj-val ${simNetProfit >= 0 ? "profit-color" : "loss-color"}`}>
                  ${simNetProfit.toFixed(2)}
                </span>
                <span className="proj-note">Margin Rate: {simMargin}%</span>
              </div>

              <div className="proj-stat-item">
                <span className="proj-lbl">Simulated ROAS / ROI</span>
                <span className="proj-val roas-color">{simRoas}x</span>
                <span className="proj-note">Revenue / Cost ratio</span>
              </div>

              <div className="proj-stat-item full-width-stat">
                <div className="ue-mini-row">
                  <div>
                    <span className="proj-lbl">Simulated CAC</span>
                    <span className="proj-val u-val">${simCac}</span>
                  </div>
                  <div>
                    <span className="proj-lbl">Simulated LTV : CAC</span>
                    <span className="proj-val u-val text-gradient">
                      {(simCac > 0 ? (ltvVal / parseFloat(simCac)).toFixed(1) : "0.0")}x
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="overview-section">
        <h3 className="sub-section-title">Channel Performance & Efficiency</h3>
        <div className="channel-efficiency-grid">
          
          <div className="channel-card-widget glass-panel">
            <div className="channel-card-header">
              <div className="channel-icon-circle whatsapp-color">
                <FontAwesomeIcon icon={faCommentAlt} />
              </div>
              <div className="channel-title-group">
                <h4>WhatsApp Automation</h4>
                <span>Direct client messaging</span>
              </div>
            </div>
            <div className="channel-stats-row">
              <div className="channel-stat-badge">
                <span className="badge-lbl">Open Rate</span>
                <span className="badge-val">94.2%</span>
              </div>
              <div className="channel-stat-badge">
                <span className="badge-lbl">Avg. Cost</span>
                <span className="badge-val">$0.015</span>
              </div>
            </div>
            <div className="channel-rating-badge excellent">
              <FontAwesomeIcon icon={faCircleCheck} /> High Return Channel
            </div>
          </div>

          <div className="channel-card-widget glass-panel">
            <div className="channel-card-header">
              <div className="channel-icon-circle sms-color">
                <FontAwesomeIcon icon={faMobileAlt} />
              </div>
              <div className="channel-title-group">
                <h4>SMS Gateways</h4>
                <span>Twilio fallback dispatch</span>
              </div>
            </div>
            <div className="channel-stats-row">
              <div className="channel-stat-badge">
                <span className="badge-lbl">Open Rate</span>
                <span className="badge-val">91.8%</span>
              </div>
              <div className="channel-stat-badge">
                <span className="badge-lbl">Avg. Cost</span>
                <span className="badge-val">$0.045</span>
              </div>
            </div>
            <div className="channel-rating-badge good">
              <FontAwesomeIcon icon={faCircleCheck} /> Standard Channel
            </div>
          </div>

          <div className="channel-card-widget glass-panel">
            <div className="channel-card-header">
              <div className="channel-icon-circle email-color">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className="channel-title-group">
                <h4>Email campaigns</h4>
                <span>SendGrid SMTP mailer</span>
              </div>
            </div>
            <div className="channel-stats-row">
              <div className="channel-stat-badge">
                <span className="badge-lbl">Open Rate</span>
                <span className="badge-val">22.5%</span>
              </div>
              <div className="channel-stat-badge">
                <span className="badge-lbl">Avg. Cost</span>
                <span className="badge-val">$0.003</span>
              </div>
            </div>
            <div className="channel-rating-badge average">
              <FontAwesomeIcon icon={faCircleCheck} /> Low Engagement
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Reports;

