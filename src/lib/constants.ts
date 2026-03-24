export const CATEGORIES = [
  { id: 1, slug: 'economica', name: 'Económica', icon: 'Banknote', color: '#10B981' },
  { id: 2, slug: 'empleo', name: 'Empleo', icon: 'Briefcase', color: '#3B82F6' },
  { id: 3, slug: 'compania', name: 'Compañía', icon: 'HeartHandshake', color: '#EC4899' },
  { id: 4, slug: 'salud', name: 'Salud', icon: 'HeartPulse', color: '#EF4444' },
  { id: 5, slug: 'vivienda', name: 'Vivienda', icon: 'Home', color: '#F59E0B' },
  { id: 6, slug: 'educacion', name: 'Educación', icon: 'GraduationCap', color: '#8B5CF6' },
  { id: 7, slug: 'legal', name: 'Legal', icon: 'Scale', color: '#6366F1' },
  { id: 8, slug: 'transporte', name: 'Transporte', icon: 'Car', color: '#14B8A6' },
  { id: 9, slug: 'alimentacion', name: 'Alimentación', icon: 'UtensilsCrossed', color: '#F97316' },
  { id: 10, slug: 'psicologia', name: 'Psicología', icon: 'Brain', color: '#A855F7' },
  { id: 11, slug: 'otro', name: 'Otro', icon: 'HandHelping', color: '#6B7280' },
] as const

export const PROFILE_TYPES = [
  { value: 'oferente', label: 'Quiero ofrecer ayuda', color: '#10B981' },
  { value: 'demandante', label: 'Necesito ayuda', color: '#3B82F6' },
  { value: 'ambos', label: 'Ambos', color: '#8B5CF6' },
] as const

export const DISTANCE_OPTIONS = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 0, label: 'Global' },
] as const
