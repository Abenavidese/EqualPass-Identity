"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TestResults() {
  // TODO: Connect to actual transaction results
  const events = [
    // Example: { eventName: 'BadgeMinted', args: { tokenId: 1, to: '0x...', badgeType: 1, claimId: '0x...' } }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados y Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay eventos recientes. Ejecuta una transacción para ver los resultados aquí.
          </p>
        ) : (
          <div className="space-y-3">
            {events.map((event, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge>{event.eventName}</Badge>
                </div>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(event.args, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
