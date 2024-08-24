import { useReactive } from "micro-reactive"
import { IndividualSaveData } from "."

const slot = useReactive({}) as IndividualSaveData

// start.mount(()=>slot({}))