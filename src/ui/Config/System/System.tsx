import { Clone, Variable } from '@/ui/Elements'
import { language, translation } from '@/translations'
import { useReactive } from 'micro-reactive'
import { Component, For, onMount } from 'solid-js'
import Button from '../Button'
import ButtonGroup from '../ButtonGroup'
import styles from '../config.module.scss'
import logger from '@/utils/Logger'
import { useStore } from '@/store/context'

const System: Component = () => {
  const t = translation.menu.options.pages.system.options
  const showAbout = useReactive(false)

  const config = useStore().config

  onMount(() => logger.info("mount"))
  return (
    <div class={styles.Options_main_content_half}>
      {/* {showAbout && <About onClose={toggleAbout} />} */}
      <ButtonGroup title={t.autoSpeed.title}>
        {/* todo:激活元素和store值有关 */}
        <Variable value={useReactive(0)}>{
          (val) =>
            <Clone count={3}>
              {(i) =>
                // todo:修改为选项对应值
                <Button key={i} signal={val} onclick={() => { }}>
                  {[t.autoSpeed.options.slow(), t.autoSpeed.options.medium(), t.autoSpeed.options.fast()][i]}
                </Button>
              }
            </Clone>
        }
        </Variable>
      </ButtonGroup>
      <ButtonGroup title={t.language.title}>
        <Variable value={useReactive(config.language())}>{
          (val) =>
            <For each={Object.keys(language)}>
              {(key) =>
                <Button key={key} signal={val} onclick={() => config.language(key as keyof typeof language)}>
                  {language[key as keyof typeof language].description}
                </Button>
              }
            </For>
        }
        </Variable>
      </ButtonGroup>
      {/* <ButtonGroup title={t.resetData.title}>
            <Button
              textList={[
                t.resetData.options.clearGameSave(),
                t.resetData.options.resetSettings(),
                t.resetData.options.clearAll(),
              ]}
              functionList={[
                () => {
                  playSeDialogOpen()
                  showGlogalDialog({
                    title: t.resetData.dialogs.clearGameSave(),
                    leftText: translation.common.yes(),
                    rightText: translation.common.no(),
                    leftFunc: () => {
                      dispatch(saveActions.resetSaves())
                      dumpSavesToStorage(0, 200)
                      dumpFastSaveToStorage()
                    },
                    rightFunc: () => { },
                  })
                },
                () => {
                  playSeDialogOpen()
                  showGlogalDialog({
                    title: t.resetData.dialogs.resetSettings(),
                    leftText: translation.common.yes(),
                    rightText: translation.common.no(),
                    leftFunc: () => {
                      dispatch(resetOptionSet())
                      dumpToStorageFast()
                    },
                    rightFunc: () => { },
                  })
                },
                () => {
                  playSeDialogOpen()
                  showGlogalDialog({
                    title: t.resetData.dialogs.clearAll(),
                    leftText: translation.common.yes(),
                    rightText: translation.common.no(),
                    leftFunc: () => {
                      dispatch(resetAllData())
                      dumpToStorageFast()
                      dispatch(saveActions.resetSaves())
                      dumpSavesToStorage(0, 200)
                      dumpFastSaveToStorage()
                    },
                    rightFunc: () => { },
                  })
                },
              ]}
              currentChecked={3}
            />
          </ButtonGroup>
          <ButtonGroup title={t.gameSave.title}>
            <Button
              textList={[t.gameSave.options.export(), t.gameSave.options.import()]}
              functionList={[exportSaves, importSaves]}
              currentChecked={2}
            />
          </ButtonGroup>
          <div class={styles.About_title_text} onClick={toggleAbout}>
            <span class={styles.About_text}>{t.about.title}</span>
          </div> */}
    </div>
  )
}

export default System

