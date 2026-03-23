import { requireAuth } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { notFound }    from 'next/navigation'
import IDCardTab       from '../profile/components/IDCardTab'

export default async function IDCardPage() {
  const session = await requireAuth()

  const member = await prisma.member.findUnique({
    where:  { id: session.user.id },
    select: {
      id: true, name: true, role: true, tier: true,
      imageUrl: true, department: true, points: true,
      createdAt: true,
    },
  })

  if (!member) notFound()

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: '#202124' }}>
        Member ID Card
      </h2>
      <p style={{ color: '#5F6368', marginBottom: 32, fontSize: '0.9rem' }}>
        Your official GDGoC CUI Wah membership card. Professional verification for events and workshops.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', background: '#fafafa', borderRadius: 16, border: '1px solid #f0f0f0' }}>
        <IDCardTab member={member} />
      </div>

      <div style={{ marginTop: 32, maxWidth: 500 }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#5F6368', marginBottom: 12 }}>
          Printing Instructions
        </h3>
        <ul style={{ fontSize: '0.85rem', color: '#5F6368', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li>• Use high-quality photo paper or PVC card for best results.</li>
          <li>• Ensure "Background Graphics" is enabled in browser print settings.</li>
          <li>• Standard ID-1 size: 85.60 × 53.98 mm.</li>
        </ul>
      </div>
    </div>
  )
}
