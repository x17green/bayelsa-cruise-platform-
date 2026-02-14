/**
 * Form - React Hook Form integration with validation
 * 
 * Built on React Hook Form with glassmorphism design system.
 * Provides accessible form fields with validation, error messages, and descriptions.
 * Integrates seamlessly with migrated Input, Label, and other form components.
 * 
 * @example
 * ```tsx
 * import { useForm } from 'react-hook-form'
 * import { zodResolver } from '@hookform/resolvers/zod'
 * import * as z from 'zod'
 * 
 * const formSchema = z.object({
 *   username: z.string().min(2, 'Username must be at least 2 characters'),
 *   email: z.string().email('Invalid email address'),
 * })
 * 
 * function MyForm() {
 *   const form = useForm<z.infer<typeof formSchema>>({
 *     resolver: zodResolver(formSchema),
 *     defaultValues: { username: '', email: '' },
 *   })
 * 
 *   function onSubmit(values: z.infer<typeof formSchema>) {
 *     console.log(values)
 *   }
 * 
 *   return (
 *     <Form {...form}>
 *       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
 *         <FormField
 *           control={form.control}
 *           name="username"
 *           render={({ field }) => (
 *             <FormItem>
 *               <FormLabel>Username</FormLabel>
 *               <FormControl>
 *                 <Input placeholder="johndoe" {...field} />
 *               </FormControl>
 *               <FormDescription>
 *                 This is your public display name.
 *               </FormDescription>
 *               <FormMessage />
 *             </FormItem>
 *           )}
 *         />
 *         
 *         <FormField
 *           control={form.control}
 *           name="email"
 *           render={({ field }) => (
 *             <FormItem>
 *               <FormLabel>Email</FormLabel>
 *               <FormControl>
 *                 <Input type="email" placeholder="john@example.com" {...field} />
 *               </FormControl>
 *               <FormMessage />
 *             </FormItem>
 *           )}
 *         />
 *         
 *         <Button type="submit">Submit</Button>
 *       </form>
 *     </Form>
 *   )
 * }
 * ```
 * 
 * @features
 * - React Hook Form integration with type safety
 * - Zod/Yup schema validation support
 * - Accessible form fields with ARIA attributes
 * - Error messages with semantic destructive color
 * - Field descriptions with muted text
 * - Label association with form controls
 * - Validation state management
 * - Error state styling
 * 
 * @accessibility
 * - ARIA describedby for descriptions and errors
 * - ARIA invalid state on error
 * - Label association with htmlFor
 * - Screen reader friendly error messages
 * 
 * @components
 * - Form: Form provider (React Hook Form FormProvider)
 * - FormField: Field controller wrapper
 * - FormItem: Field container with spacing
 * - FormLabel: Field label (integrates with Label component)
 * - FormControl: Input wrapper with ARIA attributes
 * - FormDescription: Field help text
 * - FormMessage: Validation error message
 */
'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'

import { Label } from '@/src/components/ui/label'
import { cn } from '@/src/lib/utils'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

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

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-fg-muted', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
