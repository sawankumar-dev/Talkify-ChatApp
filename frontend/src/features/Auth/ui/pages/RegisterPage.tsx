import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const RegisterPage = () => {
  return (
    <div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input type="text" placeholder="Enter your name" id="name"/>
        </Field>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input type="text" placeholder="Enter your username" id="username"/>
        </Field>
      </FieldGroup>
    </div>
  )
}

export default RegisterPage