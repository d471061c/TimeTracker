import React, { useState } from 'react'
import { Header, Button, Modal, Icon, Input } from 'semantic-ui-react'

const useRenameItemModal = ({ onRename }) => {
    const [item, setItem] = useState(null)
    const [name, setName] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const invoke = (item) => () => {
        setItem(item)
        setName(item.name)
        setModalOpen(true)
    }

    const onClose = () => {
        setItem(null)
        setModalOpen(false)
    }

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const editItem = () => {
        onRename({...item, name})
        setModalOpen(false)
        setItem(null)
    }

    return {
        item,
        invoke,
        onClose,
        editItem,
        modalOpen,
        name,
        handleNameChange
    }
}

const RenameItemModal = ({
    header, item,
    modalOpen, onClose,
    editItem,
    name, handleNameChange
}) => (
    <Modal 
        open={modalOpen}
        size={"small"}
        basic 
        >
        <Header icon='pencil' content={header} />
        <Modal.Content>
            <p> Rename '<strong>{ item?.name }</strong>' </p> 
            <Input fluid value={name} onChange={handleNameChange} focus placeholder='Name' />
        </Modal.Content>
        <Modal.Actions>
            <Button onClick={onClose} inverted>
                <Icon name='remove' /> Cancel
            </Button>
            <Button color='green' onClick={editItem} inverted>
                <Icon name='checkmark' /> Save
            </Button>
        </Modal.Actions>
    </Modal>
)

export {
    useRenameItemModal,
    RenameItemModal
}