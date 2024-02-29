import { CurrentDateProvider } from './currentDate';
import { CollabsProvider } from './collabs';
import { EventsProvider } from './events';

const Store = ({children}: {children: React.ReactNode}) => {
    return <CurrentDateProvider>
        <CollabsProvider>
            <EventsProvider>
                {children}
            </EventsProvider>
        </CollabsProvider>
    </CurrentDateProvider>
};

export default Store;