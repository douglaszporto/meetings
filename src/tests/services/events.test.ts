import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { SaveEvent, DeleteEvent, GetEvents } from '../../services/events';
import { EventItem } from '../../types/event';

const generateEvent = (title: string, time: string, duration: number):EventItem => ({
    id: uuid(),
    title: title,
    date: dayjs(time),
    time: dayjs(time),
    duration: duration,
    collabs: [{
        id:uuid(), 
        name:'Collab 1', 
        color:"#000"
    }, {
        id:uuid(), 
        name:'Collab 2', 
        color:"#fff"
    }],
});

describe('Services/Events', () => {
    it('Deve retornar a lista de eventos salvos', async () => {
        // Arrange
        let ev1 = generateEvent('Event 1', '2024-01-01T10:00:00', 2);
        let ev2 = generateEvent('Event 2', '2024-01-02T14:00:00', 1);
        const events = {
            [ev1.id]: ev1,
            [ev2.id]: ev2,
        };
        localStorage.setItem('events', JSON.stringify(events));

        const result = await GetEvents();
        const list = result.list as EventItem[];

        expect(result.status).toBe('success');
        expect(list).toHaveLength(2);
        expect(list[0].id).toBeTruthy();
        expect(list[0].title).toBe('Event 1');
        expect(list[0].date.format('YYYY-MM-DD')).toBe('2024-01-01');
        expect(list[0].time.format('HH:mm')).toBe('10:00');
        expect(list[0].duration).toBe(2);
        expect(list[1].id).toBeTruthy();
        expect(list[1].title).toBe('Event 2');
        expect(list[1].date.format('YYYY-MM-DD')).toBe('2024-01-02');
        expect(list[1].time.format('HH:mm')).toBe('14:00');
        expect(list[1].duration).toBe(1);
    });

    it('Deve tratar error ao receber localStorage quebrado', async () => {
        localStorage.setItem('events', 'invalidData');

        const result = await GetEvents();

        expect(result.status).toBe('error');
        expect(result.error).toBeInstanceOf(Error);
    });

    it('Deve salvar os eventos informados', async () => {

        const ev1 = generateEvent('Event 1', '2024-01-01T10:00:00.000Z', 1);
        const ev2 = generateEvent('Event 2', '2024-01-02T14:00:00.000Z', 1);
        const ev3 = generateEvent('Event 3', '2024-01-02T16:00:00.000Z', 2);
        localStorage.removeItem('events');

        await SaveEvent(ev1);
        await SaveEvent(ev2);
        await SaveEvent(ev3);
        await SaveEvent({
            ...ev2,
            title: 'Event A',
            date: dayjs('2024-01-02T12:00:00'),
            time: dayjs('2024-01-02T12:00:00'),
            duration: 3
        });

        const result = await GetEvents();
        const list = result.list as EventItem[];

        expect(result.status).toBe('success');
        expect(list).toHaveLength(3);
        expect(list[1].id).toBeTruthy();
        expect(list[1].title).toBe('Event A');
        expect(list[1].date.format('YYYY-MM-DD')).toBe('2024-01-02');
        expect(list[1].time.format('HH:mm')).toBe('12:00');
        expect(list[1].duration).toBe(3);
    });

    it('Deve excluir os eventos informados', async () => {
        const ev1 = generateEvent('Event 1', '2024-01-01T10:00:00', 1);
        const ev2 = generateEvent('Event 2', '2024-01-02T14:00:00', 1);
        const ev3 = generateEvent('Event 3', '2024-01-02T16:00:00', 2);
        const events = {
            [ev1.id]: ev1,
            [ev2.id]: ev2,
            [ev3.id]: ev3,
        };
        localStorage.setItem('events', JSON.stringify(events));

        await DeleteEvent(ev2);

        const result = await GetEvents();
        const list = result.list as EventItem[];

        expect(result.status).toBe('success');
        expect(list).toHaveLength(2);
        expect(list[1].id).toBeTruthy();
        expect(list[1].title).toBe('Event 3');
        expect(list[1].date.format('YYYY-MM-DD')).toBe('2024-01-02');
        expect(list[1].time.format('HH:mm')).toBe('16:00');
        expect(list[1].duration).toBe(2);
    });
});