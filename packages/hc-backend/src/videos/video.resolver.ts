import { Resolver,Query, Args, Mutation, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Video } from "src/graphql";
import { VideoDTO } from "./dto/video.dto";
import { VideoService } from "./video.service";

@Resolver('Video')
export class VideoResolvers {
  private pubSub: PubSub;
  constructor(private readonly videoService: VideoService) {
    this.pubSub = new PubSub();
  }

  @Query()
  async videos(){
    return this.videoService.findAll()
  }

  @Mutation('createVideo')
  async create(@Args('input') args: VideoDTO): Promise<Video> {
    const video: Video = await this.videoService.create(args)
    this.pubSub.publish('videoAdded', { videoAdded: video})
    return video;
  }

@Subscription(returns => Video, {
  filter: ( payload, variables) => payload.videoAdded.title ===variables.title,

})
  videoAdded(){
this.pubSub.asyncIterator('videoAdded');
  }
}
