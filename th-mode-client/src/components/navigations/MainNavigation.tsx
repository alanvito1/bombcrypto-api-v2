import {Navigate, Route, Routes} from 'react-router-dom';
import LeaderBoardPage from "../leaderboard/LeaderBoardPage";

const MainNavigation = () => {
    return (
        <Routes>
            <Route path={'/'}>
                <Route index element={
                    <LeaderBoardPage/>
                }/>
                <Route path="*" element={<Navigate to={'/'} replace/>}/>
            </Route>
        </Routes>
    );
};

export default MainNavigation;
