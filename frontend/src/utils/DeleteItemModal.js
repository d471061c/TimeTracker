import React, { useState } from 'react'
import { Header, Button, Modal, Icon } from 'semantic-ui-react'

const useDeleteItemModal = ({ onDelete }) => {
    const [item, setItem] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const invoke = (item) => () => {
        setItem(item)
        setModalOpen(true)
    }

    const onClose = () => {
        setItem(null)
        setModalOpen(false)
    }

    const deleteItem = () => {
        onDelete(item)
        setModalOpen(false)
        setItem(null)
    }

    return {
        item,
        invoke,
        onClose,
        deleteItem,
        modalOpen
    }
}

const DeleteItemModal = ({
    header,
    modalOpen,
    item,
    onClose,
    deleteItem
}) => (
    <Modal 
        open={modalOpen}
        size={"small"}
        basic >
        <Header icon='trash' content={header} />
        <Modal.Content>
            <p>
                Do you want to delete '<strong>{ item?.name }</strong>'?
            </p>
        </Modal.Content>
        <Modal.Actions>
            <Button color='green' onClick={onClose} inverted>
                <Icon name='remove' /> Cancel
            </Button>
            <Button color='red' onClick={deleteItem} inverted>
                <Icon name='checkmark' /> Delete
            </Button>
        </Modal.Actions>
    </Modal>
)

export {
    useDeleteItemModal,
    DeleteItemModal
}