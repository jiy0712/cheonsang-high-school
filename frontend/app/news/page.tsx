import {PageShell} from "@/components/page-shell";
import {PostList} from "@/components/post-list";
import { AlbumGallery } from "@/components/album-gallery";
import {NAV_MENU} from "@/lib/menu";

//학교소식 메뉴 소개글
const menu = NAV_MENU.find((menu) => menu.href === "/news");

export default function NewsPage() {
    return (
        <PageShell
            menu={menu}
            descriptiono="공지사항, 가정통신문, 학교앨범 등 천상고의 새로운 소식을 전합니다."
            sections={{
                notice: (
                    <PostList
                        //공지사항
                        category="notice"
                        soureNote="천상고등학교 공식 홈페이지 공지사항 (실시간 제공)"
                    />
                ),
                letter: <PostList category="letter" soureNote="가정통신문 />,
                album: <AlbumGallery />,
            }}
        />
    );
}
