import React from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';

const ContextMenu = () => {
    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger asChild>
                <div style={{ padding: '10px', border: '1px solid gray' }}>
                Right-click on this file
                </div>
            </ContextMenu.Trigger>
        
            <ContextMenu.Content style={{ padding: '10px', backgroundColor: '#21232d', color: 'white' }}>
                <ContextMenu.Item onSelect={() => alert('Open')}>Open</ContextMenu.Item>
                <ContextMenu.Item onSelect={() => alert('Rename')}>Rename</ContextMenu.Item>
                <ContextMenu.Item onSelect={() => alert('Delete')}>Delete</ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Root>
    );
}

export default FileItem;
