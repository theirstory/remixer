# my-component



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [ts-video-list](../video-list)
- [ts-video-clip-selector](../video-clip-selector)
- [ts-video-output](../video-output)

### Graph
```mermaid
graph TD;
  ts-video-remixer --> ts-video-list
  ts-video-remixer --> ts-video-clip-selector
  ts-video-remixer --> ts-video-output
  ts-video-list --> ion-list
  ts-video-list --> ion-item
  ts-video-list --> ion-button
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  ts-video-clip-selector --> ts-video-player
  ts-video-player --> ts-video-controls
  ts-video-controls --> ts-timeline
  ts-video-controls --> ts-play-button
  ts-video-controls --> ts-time
  ts-video-controls --> ts-timeline-actions
  ts-play-button --> ion-button
  ts-play-button --> ion-icon
  ts-timeline-actions --> ion-button
  ts-timeline-actions --> ion-icon
  ts-video-output --> ts-video-player
  ts-video-output --> ion-reorder-group
  ts-video-output --> ion-item
  ts-video-output --> ion-label
  ts-video-output --> ion-button
  ts-video-output --> ion-icon
  ts-video-output --> ion-reorder
  ion-reorder --> ion-icon
  style ts-video-remixer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
