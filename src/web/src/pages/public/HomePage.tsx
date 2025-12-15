import { Link } from 'react-router-dom'
import { Wifi, Smartphone, Tv, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function HomePage() {
  const services = [
    {
      icon: Wifi,
      title: 'Fast Internet',
      description: 'Ultra-fast fiber internet up to 1Gbps',
      features: ['Unlimited data', 'No contracts', '24/7 support'],
    },
    {
      icon: Smartphone,
      title: 'Mobile Plans',
      description: '5G mobile plans with great coverage',
      features: ['Nationwide 5G', 'Unlimited calls', 'International roaming'],
    },
    {
      icon: Tv,
      title: 'TV & Streaming',
      description: 'Premium channels and streaming',
      features: ['200+ channels', '4K streaming', 'Cloud DVR'],
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-dark to-brand-medium text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to CoreWave
            </h1>
            <p className="text-xl mb-8 text-white/90">
              High-speed internet, mobile, and TV services designed for modern living.
              Get connected with plans that fit your lifestyle.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary">
                View Plans
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of telecom services designed to keep you connected
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-foreground">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/offers" className="inline-flex items-center text-primary hover:underline">
                    Learn more <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            No hidden fees. No surprises. Just great service at competitive prices.
          </p>
          <Link to="/offers">
            <Button size="lg">View All Plans</Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied customers today
          </p>
          <Button size="lg" variant="secondary">
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  )
}
