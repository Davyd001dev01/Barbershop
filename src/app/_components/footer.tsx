//export interface Props { }

import { Card, CardContent } from "./ui/card"

export default function Footer() {
  return (
    <footer>
      <Card>
        <CardContent className="px-5 py-6">
          <p className="text-sm text-gray-400">
            &copy;2024 Copyright <strong>FWS Barber</strong>
          </p>
        </CardContent>
      </Card>
    </footer>
  )
}
