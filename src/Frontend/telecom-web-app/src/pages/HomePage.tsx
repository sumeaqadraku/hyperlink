function HomePage() {
  return (
    <div>
      <h1 className="page-title">Welcome to Telecom Services</h1>
      <div className="card">
        <h2>Microservices Architecture</h2>
        <p>This application demonstrates a modern microservices architecture with:</p>
        <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
          <li>Catalog Service - Product and tariff plan management</li>
          <li>Billing Service - Invoice and payment processing</li>
          <li>Customer Service - Customer account management</li>
          <li>Provisioning Service - SIM card and device provisioning</li>
        </ul>
      </div>
      
      <div className="card">
        <h2>Technology Stack</h2>
        <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
          <li>Backend: .NET 10.0 with Clean Architecture</li>
          <li>Database: MySQL (separate DB per service)</li>
          <li>Frontend: React 18 with TypeScript</li>
          <li>API Gateway: YARP</li>
        </ul>
      </div>
    </div>
  )
}

export default HomePage
