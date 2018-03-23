import { InstagramMediaComponent } from "./instagram-media";
import { LayoutComponent } from "./layout";
import { MapComponent } from "./map";
import { TopBarComponent } from "./topbar";

export * from "./instagram-media";
export * from "./layout";
export * from "./map";
export * from "./topbar";

export const UI_COMPONENTS: any[] = [
	LayoutComponent,
	MapComponent,
	TopBarComponent,
	InstagramMediaComponent
];
