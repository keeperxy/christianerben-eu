import * as React from "react"
import {
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form"

// Original FormFieldContextValue and FormFieldContext
export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

export const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null
)

// Original FormItemContextValue and FormItemContext
export type FormItemContextValue = {
  id: string
}

export const FormItemContext = React.createContext<FormItemContextValue | null>(
  null
)

// Original useFormField hook
export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)


  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}
