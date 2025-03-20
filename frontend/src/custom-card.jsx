export const Card = ({ className = "", children }) => {
    return <div className={`rounded-lg border bg-card text-card-foreground shadow ${className}`}>{children}</div>
  }
  
  export const CardContent = ({ className = "", children }) => {
    return <div className={`p-6 pt-0 ${className}`}>{children}</div>
  }
  
  