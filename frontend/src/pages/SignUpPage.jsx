import { useState } from "react"

function SignUpPage() {

  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  return (
    <div>SignUpPage</div>
  )
}

export default SignUpPage