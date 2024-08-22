import { useReactive } from "micro-reactive"

const slot = useReactive({}) as IndividualSaveData

start.mount(()=>slot({}))