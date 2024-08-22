import { Component } from "solid-js"
import { Clone } from "../Elements"
import { navigate } from "../router"
import { translation } from "../translations"
import styles from "./title.module.scss"

/**
 * 标题页
 */
const Title: Component = () => {
  const t = translation.title
  return (
    <>
      <div class={styles.Title_backup_background} />
      <div
        class={styles.Title_main}
        style={{
          'background-image': 'url(https://demo.openwebgal.com/game/background/WebGAL_New_Enter_Image.png)',
          'background-size': 'cover',
        }}
      >
        <div class={styles.Title_buttonList}>
          <Clone count={5}>{
            (i) =>
              <div
                class={styles.Title_button}
                // todo:按键音效
                onmouseover={() => { }}
                onClick={[() => { }, () => { }, () => navigate("Option"), () => { }, () => { }][i]}
              >
                <div class={styles.Title_button_text}>{
                  // @ts-ignore
                  t[["start", "continue", "options", "load", "extra"][i]].title()
                }</div>
              </div>
          }
          </Clone>
        </div>
      </div>
    </>
  )
}

export default Title
