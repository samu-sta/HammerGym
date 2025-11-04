import { Activity, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dss/ui/select"
import { mockUsers } from "@/data/dss-users"

export function DashboardHeader({ selectedUserId, onUserChange }) {
  return (
    <header className="border-b border-border bg-card">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-balance">Sistema de Soporte de Decisiones</h1>
        </div>

        <Select value={selectedUserId} onValueChange={onUserChange}>
          <SelectTrigger className="w-[200px]">
            <User className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Seleccionar usuario" />
          </SelectTrigger>
          <SelectContent>
            {mockUsers.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </nav>
    </header>
  )
}
