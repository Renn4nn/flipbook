import { useRouter } from "next/navigation"
import styles from "./backbutton.module.css"
import { ArrowBigLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <div className={styles.backButtonContainer}>
      <button
        onClick={() => router.push("/workspace")}
        className={styles.backButton}
        aria-label="Voltar"
        type="button"
      >
        <ArrowBigLeft />
      </button>
    </div>
  )
}