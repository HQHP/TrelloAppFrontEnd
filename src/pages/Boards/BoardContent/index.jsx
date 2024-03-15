/* eslint-disable no-extra-boolean-cast */
import Box from '@mui/system/Box'
import ListColumns from './ListColumns/ListColumns'
import { DndContext, useSensor, useSensors,
  DragOverlay, defaultDropAnimationSideEffects, closestCorners, pointerWithin, getFirstCollision } from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customsLibararies/DndKitSensors'
import { arrayMove } from '@dnd-kit/sortable'
import { useState, useEffect, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatter'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
const ACTIVE_DRAG_ITEM_TYPE={
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
  board,
  createNewColumns,
  createNewCards,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDiffirentColumn,
  deleteColumnDetails
}) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint:{
  //   distance:10
  // } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint:{ distance:5 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint:{ delay:250, tolerance:500 } })
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumnState, setOrderedColumnState] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [columnStartState, setColumnStartState] = useState(null)
  const lastOverId = useRef(null)

  useEffect(() => {
    const orderedColumn= board.columns
    setOrderedColumnState(orderedColumn)
  }, [board])
  // tim 1 colume thep cardId
  const findColumnByCardId =(cardId) => {
    // Đoạn này cần lưu ý nên dùng c.cards thay vì c.CardsOrderByIds bởi vì ở bước handleDragOver
    // chúng ta sẽ làm dữ liệu cho card hoàn chỉnh trước rồi nới tạo CardOderIds sau
    return orderedColumnState.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumnState(prevColumn => {
      // Tim vi tri (index) cua cai overCard trong column dich
      const overCardIndex=overColumn?.cards?.findIndex(card => card._id === overCardId)
      // logic tinh toan "cardIndex moi" lay chuan ra tu thu vie
      let newCardIndex
      const isBelowOverItem =active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards.length + 1
      const nextColumns = cloneDeep(prevColumn)
      const nextActiveColumn=nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn=nextColumns.find(column => column._id === overColumn._id)
      if (nextActiveColumn ) {
        // xoa card o cai column active
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        //Them Placeholder card
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards =[generatePlaceholderCard(nextActiveColumn)]
        }
        // Cap nhap lai mang
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      if (nextOverColumn ) {
        // kiem tra xem co cards chua neu co roi thi xoa
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        const rebuild_activeDraggingCardData= {
          ...activeDraggingCardData,
          columnId:nextOverColumn._id
        }
        // Them card dang keo vao column moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        nextOverColumn.cards = nextOverColumn.cards.filter(card => ! card.FE_PlaceholderCard)
        // Cap nhap lai mang
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDiffirentColumn(activeDraggingCardId, columnStartState._id, nextOverColumn._id, nextColumns )
      }
      return nextColumns
    })
  }
  const handleDragStart=(event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    if (event?.active?.data?.current?.columnId) {
      setColumnStartState(findColumnByCardId(event?.active?.id))
    }
  }
  // trigger trong qua trinh kep (drag)
  const handleDragOver=(event) => {
    // ko làm gì thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // Còn nếu kéo card thì xử lý thêm để có thể kéo cảrd qua lại
    const { active, over } = event
    // Nếu ko tồn tại active hoặc over thì không làm gì cả tránh crack web
    if (!active || !over) return
    // activeDraggingCard : là cái card đang được kéo
    const { id : activeDraggingCardId, data:{ current: activeDraggingCardData } } = active
    // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
    const { id : overCardId } = over
    //Tim 2 column theo 2 id o tren
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // Nếu ko tồn tại 1 trong 2 column thì không làm gì cả tránh crack web
    if (!activeColumn || !overColumn) return
    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn kéo card trong column ban đầu thì ko làm j cả
    // Vì đây đang là đoạn xử lý lúc kéo ,còn xử lý lúc kéo xong thì nó lại là vấn đề khác
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }
  const handleDragEnd=(event) => {
    const { active, over }=event
    // Nếu ko tồn tại active hoặc over thì không làm gì cả tránh crack web
    if (!active || !over) return
    // xu li keo tha card
    if (activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id : activeDraggingCardId, data:{ current: activeDraggingCardData } } = active
      // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
      const { id : overCardId } = over
      //Tim 2 column theo 2 id o tren
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // Nếu ko tồn tại 1 trong 2 column thì không làm gì cả tránh crack web
      if (!activeColumn || !overColumn) return
      if (columnStartState._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      }
      else {
        const oldCardIndex = columnStartState?.cards?.findIndex(c => c._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        const dndOrderedCard= arrayMove(columnStartState?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds=dndOrderedCard.map(card => card._id)
        setOrderedColumnState(prevColumn => {
          const nextColumns = cloneDeep(prevColumn)
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)
          targetColumn.cards = dndOrderedCard
          targetColumn.cardOrderIds=dndOrderedCardIds
          return nextColumns
        })
        moveCardInTheSameColumn(dndOrderedCard, dndOrderedCardIds, columnStartState._id )
      }
    }
    // Xu ly kep tha Column
    if (activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumnState.findIndex(c => c._id === active.id)
        const newColumnIndex = orderedColumnState.findIndex(c => c._id === over.id)
        const dndOrderedColumns= arrayMove(orderedColumnState, oldColumnIndex, newColumnIndex)
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c=> c._id)
        setOrderedColumnState(dndOrderedColumns)
        moveColumns(dndOrderedColumns)
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setColumnStartState(null)
  }
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    // tim cac diem giao nhau va cham voi con cho
    const pointerIntersections = pointerWithin(args)

    if (!pointerIntersections?.length) return
    // thuat toan phat hien va cham va tra ve mot mang cac va c
    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      const checkColumn = orderedColumnState.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners ({
          ...args,
          droppableContainers:args.droppableContainers
            .filter( container => {
              return container._id!== overId
              && checkColumn?.cardOrderIds?.includes(container._id)
            })
        })[0]?.id
      }
      lastOverId.current=overId
      return [{ id : overId }]
    }
    return lastOverId.current ? [{ id : lastOverId.current }] : []
  }, [activeDragItemType, orderedColumnState])
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd} >
      <Box sx={{
        color: 'primary.main',
        backgroundColor: 'primary.main',
        height: (theme) => theme.trello.boardContentHeight,
        width: '100%',
        display: 'flex',
        p: '10px 0'
      }}>
        <ListColumns
          columns={orderedColumnState}
          createNewColumns={createNewColumns}
          createNewCards={createNewCards}
          deleteColumnDetails={deleteColumnDetails}
        />
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activeDragItemId || activeDragItemType && null)}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box >
    </DndContext>
  )
}

export default BoardContent