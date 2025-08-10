import { FormSchema } from '../types'
const KEY = 'upliance_forms_v1'

export const saveForm = (form: FormSchema) => {
  const all = loadAllForms()
  all.push(form)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export const loadAllForms = (): FormSchema[] => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as FormSchema[]
  } catch (e) {
    console.error(e)
    return []
  }
}

export const loadFormById = (id: string): FormSchema | undefined => {
  return loadAllForms().find(f => f.id === id)
}
