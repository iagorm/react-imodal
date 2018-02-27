import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './IModal.css'

export default class IModal extends Component {
    confirmButton (onConfirm) {
        this.closeModal(onConfirm)
    } 
        
    declineButton (onDecline) {
        this.closeModal(onDecline)
    } 

    closeModal (actionBtn) {
        const modalNode = this.modal //dom node .app-modal

        modalNode.classList.remove('active')
        modalNode.classList.add('leaving')

        setTimeout(() => {
            // trigger the action after submit button
            actionBtn()

            // call callback applied to the props            
            this.props.onClose()
        }, 200)
    }

    overlayClick (e) {
        e.stopPropagation()
        
        if(!e.target.classList.contains('app-modal-overlay')) return

        this.declineButton(this.props.onDecline)
    }

    draggable (parent) {
        const parentNode = parent.childNodes[0] // .app-modal
        const modal = parent.childNodes[0].childNodes[0] // .app-modal-body
        const modalHeader = parent.childNodes[0].childNodes[0].childNodes[0] // .app-modal-header

        const mouseUp = () => {
            document.removeEventListener ("mousemove" , positions);
            document.removeEventListener ("mouseup" , mouseUp);
        } 

        const positions = (ev) => {
            const pX = ev.x - parentNode.offsetWidth / 2;
            // position of modal's header
            const pY = (ev.y - parentNode.offsetHeight / 2) + (modalHeader.offsetHeight * 2);

            modal.style.left = (pX) + "px";
            modal.style.top = (pY) + "px";

            document.addEventListener('mouseup', mouseUp)
        }

        // when mouse down over the header of 400ms...
        modalHeader.addEventListener('mousedown', e => {
            document.addEventListener('mousemove', positions)
        })
    }

    render() {
        const {title, content, confirmText, declineText, onConfirm, onDecline, open, alertMode} = this.props
        
        if(!open) return null

        return (
            <div className="app-modal" ref={modal => {
                if(modal == null) return

                modal.classList.add('active')

                // enable this feature only on desktop
                window.innerWidth > 1023 && this.draggable(modal)

                return this.modal = modal
            }}>
                <div className="app-modal-overlay" onClick={this.overlayClick}>
                    <div className="app-modal-body">
                        <div className="app-modal-header">{title}</div>
                        <div className="app-modal-content">{content}</div>
                        <div className="app-modal-footer">
                            <div className="button confirm" onClick={() => this.confirmButton(onConfirm)}>{confirmText}</div>

                            {!alertMode && <div className="button cancel" onClick={() => this.declineButton(onDecline)}>{declineText}</div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

IModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    onDecline: PropTypes.func,
    title: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    confirmText: PropTypes.string,
    declineText: PropTypes.string,
    alertMode: PropTypes.bool
}

IModal.defaultProps  = {
    title: 'Title',
    content: <br/>,
    confirmText: 'Confirm',
    declineText: 'Cancel',
    alertMode: false,
    onConfirm: function() {},
    onDecline: function() {},
    onClose: function() {}
}