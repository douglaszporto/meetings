import { v4 as uuid } from 'uuid';

import { CollabItem } from '../../types/collab';
import { SaveCollab, DeleteCollab, GetCollabs } from '../../services/collabs';

const generateCollab = (name: string, color: string):CollabItem => ({
    id: uuid(),
    name: name,
    color: color,
});

describe('Services/Collabs/', () => {
    it('Deve retornar a lista de collaboradores salvos', async () => {
        let collab1 = generateCollab('Collab 1', 'red');
        let collab2 = generateCollab('Collab 2', 'blue');
        const collabs = {
            [collab1.id]: collab1,
            [collab2.id]: collab2,
        };
        localStorage.setItem('collabs', JSON.stringify(collabs));

        const result = await GetCollabs();
        const list = result.list as CollabItem[];

        expect(result.status).toBe('success');
        expect(list).toHaveLength(2);
        expect(list[0].id).toBeTruthy();
        expect(list[0].name).toBe('Collab 1');
        expect(list[0].color).toBe('red');
        expect(list[1].id).toBeTruthy();
        expect(list[1].name).toBe('Collab 2');
        expect(list[1].color).toBe('blue');
    });

    it('Deve tratar error ao receber localStorage quebrado', async () => {
        localStorage.setItem('collabs', 'invalidData');

        const result = await GetCollabs();

        expect(result.status).toBe('error');
        expect(result.error).toBeInstanceOf(Error);
    });

    it('Deve salvar os colaboradores informados', async () => {

        const collab1 = generateCollab('Collab 1', 'red');
        const collab2 = generateCollab('Collab 2', 'blue');
        const collab3 = generateCollab('Collab 3', 'green');
        localStorage.removeItem('collabs');

        await SaveCollab(collab1);
        await SaveCollab(collab2);
        await SaveCollab(collab3);
        await SaveCollab({
            ...collab2,
            name: 'Collab A',
            color: 'yellow',
        });

        const result = await GetCollabs();
        const list = result.list as CollabItem[];

        expect(result.status).toBe('success');
        expect(list).toHaveLength(3);
        expect(list[1].id).toBeTruthy();
        expect(list[1].name).toBe('Collab A');
        expect(list[1].color).toBe('yellow');
    });

    it('Deve excluir os colaboradores informados', async () => {
        const collab1 = generateCollab('Collab 1', 'red');
        const collab2 = generateCollab('Collab 2', 'blue');
        const collab3 = generateCollab('Collab 3', 'green');
        const collabs = {
            [collab1.id]: collab1,
            [collab2.id]: collab2,
            [collab3.id]: collab3,
        };
        localStorage.setItem('collabs', JSON.stringify(collabs));

        await DeleteCollab(collab2);

        const result = await GetCollabs();
        const list = result.list as CollabItem[];

        expect(result.status).toBe('success');
        expect(list).toHaveLength(2);
        expect(list[1].id).toBeTruthy();
        expect(list[1].name).toBe('Collab 3');
        expect(list[1].color).toBe('green');
    });
});