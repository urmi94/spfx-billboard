import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './BillboardWebPart.module.scss';
import * as strings from 'BillboardWebPartStrings';

import { SPComponentLoader } from '@microsoft/sp-loader';

import * as $ from 'jquery';
// require('Bluebox.Util');
// require('Bluebox.Constants');
// require('Bluebox.Loader');
// require('Bluebox.UtilWait');
// require('Bluebox.Billboard');

declare var jQuery:any;
declare var Bluebox:any;

var _options = {
  data: {
    subSiteUrl: "",                 //Site subsite url, empty if list is on site collection level.
    listTitle: "Billboard",         //List Title
    category: "Initiative",         //Data Category to display
  },

  display: {
    htmlId: 'bb-billboard',         //HTML ID to inject the data, Make sure it matches with the ID at the top.

    itemLimit: 5,                   //Maximum number of items to display, 0 to set as no limit.
    itemDuration: 7,                //Number of seconds to cycle the item, 0 to disable cycling.

    includePadding: false,          //Set to false in order to remove padding.
    includeTitle: false,			//Set to true to render image caption.

    renditionWidth: 600,            //Set to 0 to skip rendition.
    renditionHeight: 205,           //Set to 0 to skip rendition.
  }
};

export interface IBillboardWebPartProps {
  description: string;
}

export default class BillboardWebPart extends BaseClientSideWebPart<IBillboardWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = '<div id="bb-billboard" class="bb-listview"></div>';

     SPComponentLoader.loadScript('https://blueboxsolutionsdev.sharepoint.com/teams/devs_318_bbstyling/_catalogs/masterpage/Bluebox/scripts/Bluebox.Constants.js', {globalExportsName: 'Bluebox.Constants'})
      .then(() => {
        SPComponentLoader.loadScript('https://blueboxsolutionsdev.sharepoint.com/teams/devs_318_bbstyling/_catalogs/masterpage/Bluebox/scripts/Bluebox.Loader.js', {globalExportsName: 'Bluebox.Loader'})
        .then(() => {
          SPComponentLoader.loadScript('https://blueboxsolutionsdev.sharepoint.com/teams/devs_318_bbstyling/_catalogs/masterpage/Bluebox/webparts/billboard/billboard_utilwait.js', {globalExportsName: 'Bluebox.Billboard'})
          .then(()=> Bluebox.Billboard.Execute(true,_options))
          .catch(() => console.log("Bluebox.Billboard not loaded"));
        })
        .catch(() => console.log("Bluebox.Loader not loaded"));
      })
      .catch(() => console.log("Bluebox.Constants not loaded"));
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
