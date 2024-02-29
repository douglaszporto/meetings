import dayjs, { Dayjs } from 'dayjs';

import { EventItem } from '../../types/event';
import { GetWeekByDate } from '../../services/dates';
import { CheckTimeConflict } from '../../services/dates';


const generateEvent = (time: string, duration: number):EventItem => ({
    id: "",
    title: "",
    date: dayjs(time),
    time: dayjs(time),
    duration: duration,
    collabs: [],
});


describe('Services/Dates/CheckTimeConflict', () => {
    it('Deve retornar TRUE quando há conflito', () => {
        const event1 = generateEvent('2022-01-01T10:00:00', 2);
        const event2 = generateEvent('2022-01-01T11:00:00', 2);

        const result = CheckTimeConflict(event1, event2);
        expect(result).toBe(true);
    });

    it('Deve retornar FALSE quando não há conflito', () => {
        const event1 = generateEvent('2022-01-01T10:00:00', 2);
        const event2 = generateEvent('2022-01-01T12:00:00', 2);

        const result = CheckTimeConflict(event1, event2);
        expect(result).toBe(false);
    });

    it('Deve retornar TRUE quando um evento está interiamente dentro de outro', () => {
        const event1 = generateEvent('2022-01-01T10:00:00', 3);
        const event2 = generateEvent('2022-01-01T11:00:00', 1);

        const result = CheckTimeConflict(event1, event2);
        expect(result).toBe(true);
    });
});

describe('Services/Dates/GetWeekByDate', () => {
    it('Deve retornar a semana correta', () => {
        const date: Dayjs = dayjs('2024-01-01');
        const expectedWeek = [
            { date: dayjs('2023-12-31'), isToday: false, name: 'SUN' },
            { date: dayjs('2024-01-01'), isToday: false, name: 'MON' },
            { date: dayjs('2024-01-02'), isToday: false, name: 'TUE' },
            { date: dayjs('2024-01-03'), isToday: false, name: 'WED' },
            { date: dayjs('2024-01-04'), isToday: false, name: 'THU' },
            { date: dayjs('2024-01-05'), isToday: false, name: 'FRI' },
            { date: dayjs('2024-01-06'), isToday: false, name: 'SAT' },
        ];

        const result = GetWeekByDate(date);
        expect(result).toEqual(expectedWeek);
    });

    it('Deve encontrar o dia de hoje', () => {
        const date: Dayjs = dayjs();
        const startOfWeek = date.startOf('week');

        const expectedWeek = Array.from(new Array(7)).map((_, i) => {
            const date = startOfWeek.add(i, 'day');
            return {
                date,
                isToday: date.isSame(dayjs(), 'day'),
                name: date.format('ddd').toUpperCase(),
            };
        });

        const result = GetWeekByDate(date);
        expect(result).toEqual(expectedWeek);
    });
});