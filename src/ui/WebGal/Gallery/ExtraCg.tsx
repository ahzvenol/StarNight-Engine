import type { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import useSoundEffect from '@/hooks/useSoundEffect'
import { useValue } from '@/hooks/useValue'
import styles from '@/UI/Extra/extra.module.scss'
import { ExtraCgElement } from '@/ui/WebGal/Gallery/ExtraCgElement'
import './extraCG_animation_List.scss'

export function ExtraCg() {
    const cgPerPage = 8
    const extraState = useSelector((state: RootState) => state.userData.appreciationData)
    const pageNumber = Math.ceil(extraState.cg.length / cgPerPage)
    // const pageNumber = 10;
    const currentPage = useValue(1)
    const { playSeEnter, playSeClick } = useSoundEffect()

    // 开始生成立绘鉴赏的图片
    const showCgList = []
    const len = extraState.cg.length
    for (
        let i = (currentPage.value - 1) * cgPerPage;
        i < Math.min(len, (currentPage.value - 1) * cgPerPage + cgPerPage);
        i++
    ) {
        const index = i - (currentPage.value - 1) * cgPerPage
        const deg = Random(-5, 5)
        const temp = (
            <ExtraCgElement
                name={extraState.cg[i].name}
                imgUrl={extraState.cg[i].url}
                transformDeg={deg}
                index={index}
                key={index.toString() + extraState.cg[i].url}
            />
        )
        showCgList.push(temp)
    }

    // 生成cg鉴赏的导航
    const showNav = []
    for (let i = 1; i <= pageNumber; i++) {
        let className = styles.cgNav
        if (currentPage.value === i) {
            className = className + ' ' + styles.cgNav_active
        }
        const temp = (
            <div
                onClick={() => {
                    currentPage.set(i)
                    playSeClick()
                }}
                onMouseEnter={playSeEnter}
                class={className}>
                {i}
            </div>
        )
        showNav.push(temp)
    }

    return (
        <div class={styles.cgMain}>
            <div class={styles.cgShowDiv}>
                <div class={styles.cgShowDivWarpper}>{showNav}</div>
            </div>
            <div class={styles.cgContainer}>{showCgList}</div>
        </div>
    )
}

function Random(min: number, max: number) {
    return Math.round(Math.random() * (max - min)) + min
}
